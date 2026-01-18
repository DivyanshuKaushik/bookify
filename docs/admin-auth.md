# Admin Authentication Setup

This guide walks through creating the super admin user and managing platform administration access.

## 🎯 What is super_admin?

The **super_admin** role is:
- **Global** - Not tied to any organization
- **Platform-level** - Has access to the entire admin dashboard
- **Restricted** - Can only be created manually by you via Supabase

### Permissions

Super admin can:
✅ View all organizations  
✅ Create new organizations  
✅ Onboard new owners (create their auth accounts)  
✅ View platform analytics  
✅ Manage system settings  

Super admin **cannot**:
❌ Access organization-specific data directly (uses organization owner accounts)  
❌ Modify bookings or payments (those are owner responsibilities)  

## 📋 How to Create the Super Admin User

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click your project
3. Navigate to **Authentication → Users**

### Step 2: Create Auth User

1. Click **Add User** (or "Create User")
2. Enter admin credentials:
   - **Email**: `admin@yourcompany.com` (or your preferred email)
   - **Password**: Set a strong password
   - Check "Auto send invite" (optional)
3. Click **Create User**
4. **Copy the generated User UUID** (you'll need it next)

Example UUID format:
```
550e8400-e29b-41d4-a716-446655440000
```

### Step 3: Create Profile Record

The auth user is created, but we also need a profile record for the app to recognize them.

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Run this SQL (replace UUID with the one from Step 2):

```sql
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  organization_id,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_UUID_HERE',
  'Platform Admin',
  'admin@yourcompany.com',
  'super_admin',
  NULL,
  NOW(),
  NOW()
);
```

**Example with real UUID:**
```sql
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  organization_id,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Platform Admin',
  'admin@company.com',
  'super_admin',
  NULL,
  NOW(),
  NOW()
);
```

### Step 4: Verify Setup

1. Go to your app (http://localhost:3000)
2. Click **Sign In**
3. Enter the admin email and password from Step 2
4. Should be automatically redirected to `/admin`

If you don't see the admin dashboard, check the troubleshooting section below.

## 🔐 Admin Login Flow

```
Admin opens app
    ↓
User visits / (landing page)
    ↓
Checks if logged in
    ├─ NOT logged in → Redirect to /login
    └─ Logged in → Check role
         ├─ super_admin → Redirect to /admin
         ├─ owner/manager → Redirect to /dashboard
         └─ unknown role → Redirect to /login (error)
    ↓
Admin enters credentials at /login
    ↓
System verifies:
    1. Credentials valid in Supabase Auth
    2. Profile exists in database
    3. Role is super_admin
    ↓
Set HTTP-only cookie with session
    ↓
Redirect to /admin (admin dashboard)
```

## 🛡️ Admin Route Access

All routes under `/admin/*` are protected:

| Route | Purpose | Access |
|-------|---------|--------|
| `/admin` | Admin dashboard home | super_admin only |
| `/admin/organizations` | Manage organizations | super_admin only |
| `/admin/users` | Manage users | super_admin only |
| `/admin/analytics` | Platform analytics | super_admin only |
| `/admin/disputes` | Handle disputes | super_admin only |
| `/admin/payments` | Payment management | super_admin only |
| `/admin/settings` | System settings | super_admin only |

### Access Control Implementation

Protection happens in multiple layers:

1. **Middleware** (`/proxy.ts`)
   - Checks session validity
   - Verifies token is fresh
   - Redirects unauthenticated users to `/login`

2. **Route Handler** (each `/admin/*` page)
   - Checks user role is exactly `super_admin`
   - Redirects non-admin users to `/dashboard`
   - Shows "Access Denied" message

3. **Database** (Row Level Security)
   - Prevents direct data access without proper role
   - Enforces organization isolation

## 🔑 Environment Variables for Admin

Admin operations require the **service role key**:

```env
# Required for admin endpoints
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

This key is used to:
- Create new organizations
- Create owner auth accounts
- Manage user roles
- Bypass row level security (for admin operations)

**⚠️ Keep this key secure** - store only on server, never expose to client.

## ❌ Common Admin Auth Errors & Fixes

### "Access Denied" when visiting /admin

**Problem**: User exists but role is not `super_admin`

**Fix**:
```sql
-- Check the user's current role
SELECT id, role, email FROM public.profiles 
WHERE email = 'admin@yourcompany.com';

-- Update to super_admin if needed
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE email = 'admin@yourcompany.com';
```

### "User profile not found" error

**Problem**: Auth user exists but no profile record

**Fix**:
1. Get the user's UUID from Supabase Dashboard → Authentication → Users
2. Run the INSERT query from Step 3 above

### Can't login even with correct credentials

**Problem**: Multiple possibilities

**Debug steps**:
1. Verify user exists in Supabase Dashboard → Authentication → Users
2. Verify profile exists:
   ```sql
   SELECT * FROM public.profiles 
   WHERE email = 'admin@yourcompany.com';
   ```
3. Verify no typos in email/password
4. Check browser cookies are enabled
5. Clear browser cache/cookies and try again

### "Service role key not configured" error

**Problem**: Admin endpoint called but `SUPABASE_SERVICE_ROLE_KEY` not set

**Fix**:
1. Get service role key from Supabase Dashboard → Settings → API
2. Add to `.env.local` (development) or platform env settings (production)
3. Restart dev server or redeploy

### Redirect loops between /login and /admin

**Problem**: Session cookie issue or authentication state mismatch

**Fix**:
1. Clear all cookies for the domain
2. Clear browser cache
3. Try logging in again
4. If persists, check browser console for errors

## 🔄 Changing Admin Password

To change the admin password:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the admin user
3. Click the three-dot menu
4. Select "Reset password"
5. Follow email link to set new password

## 🚀 Multiple Admins

To add additional admins:

1. Create new auth user (Steps 1-2)
2. Copy the new UUID
3. Insert profile with `role = 'super_admin'`:

```sql
INSERT INTO public.profiles (id, name, email, role, organization_id, created_at, updated_at)
VALUES ('NEW_UUID', 'Admin Name', 'admin2@company.com', 'super_admin', NULL, NOW(), NOW());
```

Both users can now access the admin dashboard independently.

## 📋 Admin Checklist

After setting up super admin:

- [ ] Super admin auth user created in Supabase
- [ ] Profile record inserted with role = 'super_admin'
- [ ] Can login at `/login` with admin credentials
- [ ] Automatically redirected to `/admin` dashboard
- [ ] Can see organizations section
- [ ] SUPABASE_SERVICE_ROLE_KEY configured on server
- [ ] Can create organizations via admin dashboard
- [ ] Can onboard new owners

## 🔗 Related Documentation

- [Environment Variables](environment.md)
- [Organization Onboarding](organization-onboarding.md)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
