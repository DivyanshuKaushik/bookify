# Organization Onboarding Guide

This guide walks through the complete process of onboarding a new organization (venue business) into Bookify Hall.

## 📋 Onboarding Overview

The onboarding process has three main actors and phases:

1. **Super Admin** - Creates organization and owner account
2. **Owner** - First login and profile setup
3. **Managers** (optional) - Added by owner later

```
Super Admin              Owner                Managers
    │                    │                      │
    ├─ Create org        │                      │
    ├─ Create owner user │                      │
    └─ Send credentials  │                      │
                         ├─ First login         │
                         ├─ Setup profile       │
                         ├─ Add venues          │
                         └─ Invite managers     ├─ Accept invite
                                                ├─ Setup profile
                                                └─ Start managing
```

## 🔧 Phase 1: Super Admin Creates Organization

### Step 1: Admin Logs In

1. Visit your app and go to `/login`
2. Enter super admin credentials
3. Should see admin dashboard at `/admin`

### Step 2: Navigate to Organizations

1. Click **Organizations** in admin sidebar
2. Click **Create Organization** button

### Step 3: Enter Organization Details

Fill in the organization information:

| Field | Required | Example |
|-------|----------|---------|
| **Organization Name** | Yes | "Grand Ballroom Events" |
| **Website** | No | "https://grandbballroomatl.com" |
| **Phone** | Yes | "+1-404-555-1234" |
| **Address** | No | "123 Main St, Atlanta, GA 30303" |
| **City** | No | "Atlanta" |
| **State** | No | "Georgia" |
| **Zip Code** | No | "30303" |
| **Country** | No | "United States" |

**Example:**
```
Organization Name: The Grand Pavilion
Phone: +1-415-555-1234
Address: 456 Market Street
City: San Francisco
State: California
Zip: 94102
Country: United States
```

### Step 4: Create Owner Account

After creating the organization, the system prompts to add an owner.

Fill in owner details:

| Field | Required | Example |
|-------|----------|---------|
| **Owner Name** | Yes | "Sarah Johnson" |
| **Email** | Yes | "sarah@grandbballroom.com" |
| **Phone** | Yes | "+1-404-555-5678" |

**Important**: 
- The email must be **unique** - not used by any other user
- This email will be the owner's login username
- A temporary password will be generated

### Step 5: Confirm and Send Credentials

1. Review the owner details
2. Click **Create Owner Account**
3. System generates random password
4. **Copy the credentials to share with owner**:
   ```
   Email: sarah@grandbballroom.com
   Temporary Password: xH9kL2mN5pQ8
   Login URL: https://yourdomain.com/login
   ```

**Note**: You'll need to securely share these credentials with the owner (email, secure message, etc.)

## 👤 Phase 2: Owner's First Login

### Step 1: Owner Receives Credentials

Owner receives:
- Login email
- Temporary password
- Link to login page

### Step 2: Owner Logs In

1. Visit `/login`
2. Enter email and password
3. Click "Sign In"

### Step 3: Session Created & Redirect

After successful login:
1. Session cookie is created (HTTP-only, secure)
2. Middleware verifies role (owner)
3. Automatically redirected to `/dashboard`

### Step 4: Complete Profile (Optional)

If required by your app:
1. Fill in full name, phone, avatar, etc.
2. Click "Save Profile"

### Step 5: Add First Venue

Owner is now ready to add venues:

1. Go to **Venues** in the dashboard
2. Click **Add Venue**
3. Enter venue details:
   - Name (e.g., "Main Ballroom")
   - Capacity
   - Amenities (WiFi, Parking, etc.)
   - Hourly rate
   - Images

4. Click **Save Venue**

## 👥 Phase 3: Owner Invites Managers

Once the owner is set up and has venues, they can add managers.

### For Future Implementation:

Currently, managers need to be created by super admin. Future features:
- Owner can send invite links
- Managers accept invitation
- Automatic role assignment

### Current Workaround:

To add a manager now:

1. **Super Admin** creates manager user via admin API
2. Sends manager credentials
3. Manager logs in and sees `/dashboard`

## 📊 Complete Onboarding Flow

```
SUPER ADMIN PHASE
├─ Login to /admin dashboard
├─ Create organization
│  ├─ Enter org details
│  ├─ Save to database
│  └─ Organization ID created
├─ Create owner account
│  ├─ Generate auth user in Supabase
│  ├─ Create profile record
│  ├─ Set role = 'owner'
│  └─ Link to organization
└─ Share credentials with owner

                    OWNER PHASE
                    ├─ Receive email with credentials
                    ├─ Visit /login
                    ├─ Enter email & password
                    ├─ Middleware validates session
                    ├─ Fetch profile (role = 'owner')
                    ├─ Redirect to /dashboard
                    ├─ Setup venues
                    │  ├─ Add venue 1
                    │  ├─ Add venue 2
                    │  └─ Add venue N
                    ├─ Receive first booking (optional demo)
                    └─ Ready to manage business

                                    MANAGER PHASE
                                    ├─ Receive invite
                                    ├─ Create account
                                    ├─ Login to /dashboard
                                    ├─ See only assigned venues
                                    └─ Start managing bookings
```

## 🔐 Data Created During Onboarding

### Organization Record

```sql
INSERT INTO organizations (
  name,
  website,
  phone,
  address,
  city,
  state,
  zip_code,
  country,
  stripe_account_id,
  is_active,
  created_at
) VALUES (
  'Grand Ballroom Events',
  'https://grandbballroom.com',
  '+1-404-555-1234',
  '123 Main St',
  'Atlanta',
  'Georgia',
  '30303',
  'United States',
  NULL,
  true,
  NOW()
);
```

### Owner Auth User (in Supabase Auth)

```
Email: sarah@grandbballroom.com
Created in: auth.users table
Status: Active
```

### Owner Profile Record

```sql
INSERT INTO profiles (
  id,                    -- (Supabase Auth user UUID)
  name,
  email,
  role,
  organization_id,
  created_at,
  updated_at
) VALUES (
  'uuid-from-auth-user',
  'Sarah Johnson',
  'sarah@grandbballroom.com',
  'owner',
  'org-id-from-org-table',
  NOW(),
  NOW()
);
```

## ✅ Post-Onboarding Checklist

After the owner is set up, ensure:

- [ ] Organization created successfully
- [ ] Owner can login with credentials
- [ ] Owner profile shows correct organization
- [ ] Owner can access `/dashboard`
- [ ] Owner can create venues
- [ ] Owner can see empty bookings list
- [ ] Email confirmation sent to owner (optional)
- [ ] Payment setup instructions sent (if using Stripe)
- [ ] Onboarding documentation shared with owner

## 🆘 Troubleshooting Onboarding

### Owner Can't Login

**Problem**: "Invalid credentials" error

**Checks**:
1. Verify email spelling in credentials sent
2. Verify password doesn't have typos
3. Check that email is unique (no duplicates)
4. In Supabase, verify user exists in auth.users

### Owner Sees "Access Denied"

**Problem**: Owner redirected to error page

**Causes**:
1. Profile missing from profiles table
2. Role not set to 'owner'
3. organization_id is NULL

**Fix**:
```sql
-- Verify profile exists
SELECT id, role, organization_id FROM profiles 
WHERE email = 'sarah@grandbballroom.com';

-- Ensure role is 'owner' and organization_id is set
UPDATE profiles 
SET role = 'owner', organization_id = 'org-uuid'
WHERE email = 'sarah@grandbballroom.com';
```

### Owner Sees Wrong Organization Data

**Problem**: Owner sees another organization's data

**Cause**: RLS policy issue or organization_id mismatch

**Fix**:
1. Verify owner's organization_id in profiles table
2. Check RLS policies are enabled in Supabase
3. Run: `SELECT * FROM scripts/02-enable-rls.sql`

### Can't Create Organization from Admin

**Problem**: Error when trying to create org

**Causes**:
1. SUPABASE_SERVICE_ROLE_KEY not set
2. Database constraint violation
3. Invalid input

**Fix**:
1. Check server logs for specific error
2. Verify SUPABASE_SERVICE_ROLE_KEY in environment
3. Validate org name is unique

## 📈 Future Onboarding Features

Planned enhancements:
- [ ] Email verification for owner
- [ ] Self-service invitation links for managers
- [ ] Onboarding wizard/tutorial
- [ ] Welcome email with setup checklist
- [ ] Bulk organization import
- [ ] SSO/SAML integration

## 🔗 Related Documentation

- [Admin Authentication Setup](admin-auth.md)
- [Environment Variables](environment.md)
- [API Reference](../API_REFERENCE.md)
- [Organization Onboarding API](../API_REFERENCE.md#POST-/api/admin/onboard-user)
