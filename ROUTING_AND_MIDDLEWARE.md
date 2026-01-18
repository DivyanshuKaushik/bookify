# Routing & Middleware Documentation

This document explains the routing system and middleware implementation in Bookify Hall.

## Architecture Overview

```
User Request
    ↓
[proxy.ts] ← Middleware layer (server-side)
    ↓
Route Protection & Role Checks
    ↓
Redirect or Allow Access
    ↓
Page Component
    ↓
[useAuth Hook] ← Client-side auth state
    ↓
Render or Redirect
```

## Middleware (proxy.ts)

The middleware layer runs on every request and handles:
1. Session validation
2. Route protection
3. Role-based redirects
4. Preventing infinite redirect loops

### Middleware Flow

```typescript
// 1. Extract session from cookies
const { data: { session } } = await supabase.auth.getSession()

// 2. Check route type
if (publicRoute) {
  // Allow access if no session
  // If session exists, redirect based on role
} else if (adminRoute) {
  // Check if user is super_admin
  // Redirect to dashboard if not
} else if (dashboardRoute) {
  // Check if user has owner/manager/super_admin role
  // Redirect to login if not
}

// 3. Allow or redirect
return NextResponse.next() // or NextResponse.redirect(...)
```

## Route Structure

### Public Routes

These routes are accessible to all users, with redirects for authenticated users:

```
GET /                    → Landing page
GET /login               → Login form
GET /auth/callback?code= → Email confirmation callback
```

**Behavior:**
- If no session: Show login/landing page
- If session exists: Redirect based on role
  - `super_admin` → `/admin/dashboard`
  - `owner`/`manager` → `/dashboard`

### Protected Routes (Dashboard)

These routes require authentication and owner/manager/super_admin role:

```
GET /dashboard                    → Dashboard home
GET /dashboard/venues             → Venues list
GET /dashboard/venues/[id]        → Venue detail
GET /dashboard/bookings           → Bookings list
GET /dashboard/calendar           → Calendar view
GET /dashboard/payments           → Payments list
GET /dashboard/invoices           → Invoices list
GET /dashboard/inquiries          → Inquiries list
GET /dashboard/reports            → Reports & analytics
GET /dashboard/settings           → Account settings
```

**Access Control:**
- Requires valid session
- Requires role: `owner`, `manager`, or `super_admin`
- Organization isolation via RLS policies

### Admin Routes

These routes are exclusive to super_admin users:

```
GET /admin/dashboard              → Admin dashboard
GET /admin/organizations          → Organizations management
GET /admin/users                  → Users management
GET /admin/analytics              → System analytics
GET /admin/disputes               → Dispute resolution
GET /admin/payments               → Payment oversight
GET /admin/settings               → System settings
```

**Access Control:**
- Requires valid session
- Requires role: `super_admin` only
- Any non-super_admin is redirected to `/dashboard`

## Authentication Flow

### 1. Initial Page Load (No Session)

```
User → / (landing page)
         ↓
     Check session (none found)
         ↓
     Show landing page with Sign In button
```

### 2. User Signs In

```
User → /login (form)
         ↓
     POST /api/auth/sign-in
         ↓
     Supabase validates credentials
         ↓
     Fetch user profile
         ↓
     Set session cookies
         ↓
     Redirect based on role
```

### 3. Authenticated Request

```
User → /dashboard/venues
         ↓
     [proxy.ts] checks session from cookies
         ↓
     Fetch profile to verify role
         ↓
     Allow access if role is valid
         ↓
     [useAuth hook] on client fetches fresh data
         ↓
     Render dashboard
```

### 4. Session Refresh

```
Session expires (after ~1 hour)
         ↓
Next request includes refresh token in cookies
         ↓
[proxy.ts] refreshes session automatically
         ↓
Session continues uninterrupted
```

## Session Management

### Cookies

Supabase Auth uses secure HTTP-only cookies to store session:

```
Cookie: sb-<PROJECT_ID>-auth-token=<JWT_TOKEN>
```

**Security Features:**
- HTTP-only (not accessible to JavaScript)
- Secure flag (only sent over HTTPS)
- Automatic refresh (refresh token stored separately)
- CSRF protection via SameSite attribute

### Session Lifecycle

1. **Creation**: User signs in → Session created
2. **Validation**: Every request → Middleware validates
3. **Refresh**: Automatic before expiration → Token refreshed
4. **Expiration**: After inactivity → User redirected to login
5. **Destruction**: User signs out → Session cleared

## Role-Based Access Control (RBAC)

### Roles

| Role | Dashboard Access | Admin Access | Can Create Users | Can Manage All Orgs |
|------|------------------|--------------|------------------|-------------------|
| super_admin | ✅ | ✅ | ✅ | ✅ |
| owner | ✅ | ❌ | ❌ | ❌ |
| manager | ✅ | ❌ | ❌ | ❌ |

### Authorization Layers

1. **Middleware Layer** (`proxy.ts`)
   - Blocks unauthorized route access
   - Redirects to appropriate landing page

2. **API Layer** (`/api/**`)
   - Validates user session
   - Checks role permissions
   - Returns 403 if unauthorized

3. **Database Layer** (RLS Policies)
   - Enforces data isolation by organization
   - Prevents users from accessing other organization's data
   - Applied at database level (cannot be bypassed)

4. **UI Layer** (`useAuth` hook)
   - Client-side checks for UX
   - Hides unauthorized UI elements
   - Not a security mechanism (can be bypassed in browser)

## Error Handling

### Middleware Errors

| Error | Status | Behavior |
|-------|--------|----------|
| No session | 307 | Redirect to `/login` |
| Invalid role for admin | 307 | Redirect to `/dashboard` |
| Invalid role for dashboard | 307 | Redirect to `/login` |
| Profile fetch error | 307 | Redirect to `/login` |

### API Errors

| Error | Status | Response |
|-------|--------|----------|
| No session | 401 | `{"error": "Unauthorized: No session found"}` |
| Invalid role | 403 | `{"error": "Unauthorized: User role..."}` |
| Profile not found | 403 | `{"error": "User profile not found..."}` |
| Missing fields | 400 | `{"error": "Missing required fields..."}` |

## URL Rewriting (No Public Signs-up)

The routing system disables public signup:

```
GET /auth/sign-up → 403 error
POST /api/auth/sign-up → 403 error
```

Instead, use:
```
POST /api/admin/onboard-user → Create new user (super_admin only)
```

## Redirect Loop Prevention

The middleware prevents common redirect loops:

1. **Landing Page Loop**: If user is authenticated on `/`, redirect to dashboard (not back to `/`)
2. **Login Loop**: If user is not authenticated on `/login`, stay on page (don't redirect)
3. **Admin Loop**: If user lacks admin role, redirect to `/dashboard` once (not repeatedly)

## Testing Redirect Chains

To verify routing works correctly:

1. **No Auth**: Try `/dashboard` → Should redirect to `/login`
2. **Manager Auth**: Try `/admin/*` → Should redirect to `/dashboard`
3. **Super Admin Auth**: Try `/admin/*` → Should load admin page
4. **Auth'd on Landing**: Visit `/` → Should redirect to role-based dashboard

## Performance Considerations

### Middleware Optimization

- Middleware runs on every request (use sparingly)
- Session validation happens in middleware (cached by Supabase)
- Profile fetch uses single query with select (optimized)
- No N+1 queries or unnecessary database hits

### Client-Side Optimization

- `useAuth` hook fetches once per page load
- Caches user state in React state
- Uses auth state change listener for real-time updates
- No polling or repeated requests

## Security Checklist

- ✅ All routes protected except `/` and `/login`
- ✅ Session validation on every request
- ✅ Role-based access control enforced
- ✅ No public signup
- ✅ HTTP-only secure cookies
- ✅ Server-side role verification
- ✅ RLS policies on database
- ✅ Service role key kept server-only
- ✅ Client env vars prefixed with NEXT_PUBLIC_
- ✅ Error messages don't expose sensitive info

## Debugging

### Enable Middleware Logging

Edit `proxy.ts` and uncomment console.log statements:

```typescript
console.error('[v0] Session check:', session)
console.error('[v0] Error fetching profile:', error)
```

### Check Session in Browser

Open browser DevTools → Application → Cookies:

```
Cookie Name: sb-<PROJECT_ID>-auth-token
Value: <JWT_TOKEN>
```

If this cookie is missing, the user is not authenticated.

### Test API Directly

```bash
# Test sign in
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Test admin onboarding (with super admin session)
curl -X POST http://localhost:3000/api/admin/onboard-user \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxxxx=..." \
  -d '{...}'
```

## Migration from Old System

If migrating from a system without role-based middleware:

1. Add `proxy.ts` file ✅ (Done)
2. Update database schema with role support ✅ (Done)
3. Create super admin user via SQL ✅ (See ADMIN_SETUP.md)
4. Update existing users with role assignments
5. Test all redirect flows
6. Monitor for any 403 errors in production
7. Adjust RLS policies if needed
