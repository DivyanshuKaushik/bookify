# Admin Setup & User Onboarding Guide

This guide explains how to set up the initial super admin user and onboard new users in Bookify Hall.

## Initial Super Admin Setup

### Step 1: Create Organization

First, you'll need to create an organization for your platform admin:

```sql
INSERT INTO organizations (name, phone, status, plan)
VALUES ('Platform', '+1-XXX-XXX-XXXX', 'active', 'enterprise');
```

Take note of the organization ID returned.

### Step 2: Create Auth User in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Users"
3. Click "Create user"
4. Enter:
   - Email: admin@yourdomain.com
   - Password: (secure password)
5. Enable "Auto-confirm user"
6. Click "Create user"
7. Copy the User ID (UUID)

### Step 3: Create User Profile

Now create the profile record that links the auth user to the organization:

```sql
INSERT INTO profiles (id, organization_id, role, name, email)
VALUES ('USER_UUID_FROM_STEP_2', 'ORG_UUID_FROM_STEP_1', 'super_admin', 'Platform Admin', 'admin@yourdomain.com');
```

Replace:
- `USER_UUID_FROM_STEP_2` with the user ID from Supabase
- `ORG_UUID_FROM_STEP_1` with the organization ID from Step 1

## Onboarding New Users via API

Once your super admin is set up, you can use the onboarding API to create new users:

### Endpoint

```
POST /api/admin/onboard-user
```

### Authentication

Include your super admin session (automatically handled by browser cookies).

### Request Body

```json
{
  "email": "newuser@yourdomain.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "organizationId": "org-uuid-here",
  "role": "owner"
}
```

### Valid Roles

- `super_admin` - Platform administrator with full access
- `owner` - Organization owner with full venue management access
- `manager` - Organization manager with limited access

### Example cURL Request

```bash
curl -X POST http://localhost:3000/api/admin/onboard-user \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-xxxxx=..." \
  -d '{
    "email": "manager@example.com",
    "password": "SecurePass123!",
    "name": "Jane Smith",
    "organizationId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "manager"
  }'
```

### Response

Success (201):
```json
{
  "success": true,
  "message": "User manager@example.com created successfully with role manager",
  "user": {
    "id": "user-uuid",
    "email": "manager@example.com"
  }
}
```

Error (401):
```json
{
  "error": "Unauthorized: User role super_admin not allowed"
}
```

Error (404):
```json
{
  "error": "Organization not found"
}
```

## Creating Organizations

To create a new organization for a new customer:

```sql
INSERT INTO organizations (name, phone, status, plan)
VALUES ('Acme Venues', '+1-XXX-XXX-XXXX', 'active', 'pro');
```

Then use the returned organization ID when onboarding the owner user.

## Role-Based Access

### Super Admin
- Access to `/admin/*` routes
- Can view all organizations and users
- Can create new users via onboarding API
- Can manage system settings

### Owner
- Access to `/dashboard/*` routes
- Can manage venues in their organization
- Can view all bookings and payments
- Can add managers to their organization

### Manager
- Access to `/dashboard/*` routes
- Can view and manage bookings
- Can view payments
- Limited to organization data only

## Troubleshooting

### User Profile Not Found
If a user can sign in but sees "User profile not found" error:
- Verify the profile record exists in the profiles table
- Check that the organization_id is valid
- Ensure the role is one of: `super_admin`, `owner`, `manager`

### Cannot Access Admin Dashboard
If a super admin user cannot access `/admin/*`:
- Verify the profile role is exactly `super_admin` (not `admin`)
- Clear browser cookies and try signing in again
- Check that the middleware is enabled

### Onboarding API Returns 403
- Ensure you're signed in as a super admin user
- Verify your session is valid (check browser cookies)
- Try signing out and back in

## Password Reset

To reset a user's password via Supabase:

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Users"
3. Click on the user
4. Click "Reset Password"
5. The user will receive a password reset email
