# Environment Variables Reference

This document provides a complete reference for all environment variables required and optional for Bookify Hall.

## 📋 Overview

Environment variables are split into two categories:
- **Client-side** (`NEXT_PUBLIC_*`) - Exposed to the browser
- **Server-side** - Only available on the server, never exposed to client

## ✅ Required Variables

These variables **must** be set for the application to function.

### NEXT_PUBLIC_SUPABASE_URL

**Type**: Client & Server  
**Required**: Yes  
**Scope**: Public

Your Supabase project URL.

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

**How to find it**:
1. Go to Supabase Dashboard
2. Click your project
3. Copy the URL from the API settings

### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Type**: Client & Server  
**Required**: Yes  
**Scope**: Public

The anonymous (public) key for Supabase. This allows browser clients to authenticate.

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Security Note**: This key is public and safe to expose. It has limited permissions via Row Level Security.

**How to find it**:
1. Go to Supabase Dashboard → Settings → API
2. Copy "anon public" key

### SUPABASE_SERVICE_ROLE_KEY

**Type**: Server only  
**Required**: Yes  
**Scope**: Private (Never expose to client)

The service role key with full database access. **MUST NEVER be exposed to the browser.**

Used by:
- Admin API endpoints (creating organizations, users)
- Server-side operations requiring elevated privileges

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Security Warning**: 
- Never commit this to git
- Never log or expose this value
- Store only in secure environment variable services
- Rotate regularly in production

**How to find it**:
1. Go to Supabase Dashboard → Settings → API
2. Scroll to "service_role secret"
3. Copy the value

### NEXT_PUBLIC_SITE_URL

**Type**: Client & Server  
**Required**: Yes  
**Scope**: Public

The base URL of your application. Used for:
- Auth redirects
- Cookie domain settings
- Email links

```
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔧 Optional Variables

### NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

**Type**: Client & Server  
**Required**: No (falls back to NEXT_PUBLIC_SITE_URL)  
**Scope**: Public

Alternative redirect URL for development environments.

```
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## 📝 Example .env.local File

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration (Required)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## 🚀 Deployment Configuration

### Vercel

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. For server-only variables (like `SUPABASE_SERVICE_ROLE_KEY`):
   - Set them in production environment
   - Don't expose to client builds

### Other Platforms (Railway, Render, etc.)

Follow the same approach:
1. Configure all required variables in platform's env settings
2. Keep server-only keys secure
3. Test auth flow after deployment

## ✨ Best Practices

### Development

1. **Use .env.local** (git-ignored)
   ```bash
   # Never commit .env.local
   echo ".env.local" >> .gitignore
   ```

2. **Load example variables**
   ```bash
   cp .env.example .env.local
   # Then edit with your actual values
   ```

### Production

1. **Use platform's environment manager**
   - Vercel: Project Settings → Environment Variables
   - Railway: Environment tab
   - Don't commit secrets to git

2. **Rotate keys regularly**
   - Supabase Dashboard → Settings → API
   - Generate new keys, update platform, revoke old ones

3. **Monitor access**
   - Use Supabase audit logs
   - Monitor API usage in dashboard

4. **Use separate projects for environments**
   - Dev: `your-project-dev.supabase.co`
   - Staging: `your-project-staging.supabase.co`
   - Production: `your-project.supabase.co`

## 🔍 Troubleshooting

### "Invalid API key" error

**Causes**:
- Wrong URL or anon key
- Typo in NEXT_PUBLIC_SUPABASE_URL
- Using service role key as anon key

**Fix**: Double-check values in Supabase Dashboard → Settings → API

### "Unauthorized" or "RLS policy denied" errors

**Causes**:
- User not authenticated
- Profile missing from database
- RLS policy issue

**Fix**: Verify user exists in `auth.users` and `public.profiles` tables

### Cannot access admin endpoints

**Causes**:
- User role not set to `super_admin`
- Service role key not configured
- User profile missing

**Fix**: 
1. Verify user exists in profiles table with `role = 'super_admin'`
2. Check SUPABASE_SERVICE_ROLE_KEY is set on server
3. See [docs/admin-auth.md](admin-auth.md)

### Auth redirect not working

**Causes**:
- NEXT_PUBLIC_SITE_URL doesn't match app URL
- Cookie domain mismatch
- Redirect URL not configured in Supabase

**Fix**:
1. Set NEXT_PUBLIC_SITE_URL to your actual domain
2. In Supabase Dashboard → Auth → Redirect URLs, add your app URL
3. Clear cookies and try again

## 📚 Related Documentation

- [Admin Authentication Setup](admin-auth.md)
- [Organization Onboarding](organization-onboarding.md)
- [Supabase Documentation](https://supabase.com/docs)
