# Environment Variables Setup

This document explains the required environment variables for Bookify Hall.

## Required Variables

### Client-Side Variables (Prefixed with `NEXT_PUBLIC_`)

These variables are accessible from the browser and must be configured in your Vercel project or `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Getting these values:**
1. Go to your Supabase project settings
2. Find "API" section
3. Copy the "Project URL" and "Anon public key"
4. For `NEXT_PUBLIC_SITE_URL`, use your application's base URL

### Server-Side Variables

These variables are only accessible on the server and should be configured in Vercel project settings or `.env.local` (but never committed):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Getting this value:**
1. Go to your Supabase project settings
2. Find "API" section
3. Under "Service Role Secret", copy the key
4. This key should be kept secret and only used server-side

## Setting Up Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Settings" > "Environment Variables"
3. Add all required variables
4. Make sure to add them to all environments: Production, Preview, Development

## Setting Up Variables Locally

Create a `.env.local` file in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your_value
```

## Important Security Notes

- Never commit `.env.local` to version control
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the client
- All `NEXT_PUBLIC_*` variables will be visible in the browser, so keep sensitive information in server-only variables
- Rotate your keys if they are ever exposed

## Verification

To verify your setup is correct:

1. Check that the login page loads without errors
2. Attempt to sign in with valid credentials
3. Check browser console for any Supabase connection errors
4. Verify that authenticated requests work correctly
