# Bookify Hall - Multi-Tenant Venue Booking SaaS

A production-ready multi-tenant SaaS platform for managing venue bookings, inquiries, payments, and invoicing. Built with Next.js, Supabase, and TypeScript.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with cookie-based sessions
- **Styling**: Tailwind CSS with custom design tokens
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 📋 Project Overview

Bookify Hall enables organizations to:
- Manage multiple venues with detailed information
- Handle customer bookings with status tracking
- Process payments and generate invoices
- Track inquiries and customer communications
- Generate business analytics and reports
- Manage team members (owners and managers)

## 🔐 Authentication & Authorization

### Role-Based Access Control

The system uses three primary roles:

| Role | Scope | Permissions | Access |
|------|-------|-------------|--------|
| **super_admin** | Platform | Create organizations, onboard owners, view platform analytics | `/admin/*` |
| **owner** | Organization | Manage venues, bookings, payments, add managers | `/dashboard/*` |
| **manager** | Organization | View/manage bookings, handle inquiries | `/dashboard/*` (limited) |

### Authentication Flow

```
Landing Page (/)
    ↓
[Logged In?]
    ├─ YES (super_admin) → Redirect to /admin
    ├─ YES (owner/manager) → Redirect to /dashboard
    └─ NO → Redirect to /login

Login (/login)
    ↓
Verify credentials via Supabase Auth
    ↓
Fetch user profile (role, organization_id)
    ↓
Route-based redirect via middleware
```

## 🚫 No Public Signup

**Important**: Public user registration is **disabled**. All user accounts are created by:
1. **Super Admin** - Manually creates organization owners via the admin dashboard
2. **Organization Owner** - Invites managers via the dashboard (future feature)

This ensures complete control over who can access the platform.

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Supabase project (free tier available)
- Vercel account (optional, for deployment)

### Setup Steps

1. **Clone and install**
   ```bash
   git clone <repository>
   cd bookify-hall
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```
   See [docs/environment.md](docs/environment.md) for detailed variable reference.

3. **Set up the database**
   - Run migration scripts from `/scripts` in Supabase SQL Editor:
     - `01-create-tables.sql` - Creates all database tables
     - `02-enable-rls.sql` - Enables Row Level Security policies

4. **Create super admin user**
   - See [docs/admin-auth.md](docs/admin-auth.md) for step-by-step instructions

5. **Start development server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── auth/            # Auth callbacks
│   ├── admin/               # Super admin dashboard
│   │   ├── organizations/   # Manage organizations
│   │   ├── users/           # Manage users
│   │   └── analytics/       # Platform analytics
│   ├── dashboard/           # Owner/manager dashboard
│   │   ├── venues/          # Venue management
│   │   ├── bookings/        # Booking management
│   │   ├── payments/        # Payment tracking
│   │   └── reports/         # Business reports
│   └── api/                 # API routes
│       ├── auth/            # Auth endpoints
│       ├── admin/           # Admin-only endpoints
│       ├── venues/          # Venue endpoints
│       ├── bookings/        # Booking endpoints
│       └── payments/        # Payment endpoints
├── lib/
│   ├── supabase/           # Supabase clients (browser & server)
│   ├── auth/               # Authorization utilities
│   └── utils.ts            # Helper functions
├── hooks/
│   └── use-auth.ts         # Auth state management hook
├── middleware.ts           # Route protection middleware
├── scripts/                # Database migration scripts
└── docs/                   # Documentation
```

## 📖 Documentation

- **[Environment Variables](docs/environment.md)** - Complete reference for all environment variables
- **[Admin Authentication](docs/admin-auth.md)** - How to set up super admin and manage authentication
- **[Organization Onboarding](docs/organization-onboarding.md)** - Step-by-step onboarding workflow
- **[API Reference](API_REFERENCE.md)** - Complete API endpoint documentation
- **[Routing & Middleware](ROUTING_AND_MIDDLEWARE.md)** - Architecture and security implementation

## 🔒 Security Features

✅ **Row Level Security (RLS)** - Database-level access control
✅ **Cookie-based sessions** - HTTP-only, secure session cookies
✅ **Automatic token refresh** - Via middleware
✅ **Role-based middleware** - Protects all routes
✅ **Service role key protected** - Never exposed to client
✅ **No public signup** - Complete control over user creation

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in project settings
4. Deploy

```bash
vercel --prod
```

### Deploy to Other Platforms

The application is compatible with any Node.js hosting (Railway, Render, etc.). Ensure environment variables are properly configured.

## 📞 Support & Documentation

For detailed setup instructions and troubleshooting:
- Check [docs/environment.md](docs/environment.md) for environment setup issues
- Review [docs/admin-auth.md](docs/admin-auth.md) for authentication problems
- See [docs/organization-onboarding.md](docs/organization-onboarding.md) for onboarding workflows

## 📝 License

Proprietary - All rights reserved

## 🎯 Next Steps

1. Set up environment variables
2. Create super admin user
3. Use admin dashboard to onboard first organization
4. Configure payment processing (Stripe integration ready)
5. Customize branding and email templates
# bookify
