# API Reference

This document provides detailed information about all API endpoints in Bookify Hall.

## Authentication Endpoints

### Sign In

**Endpoint:** `POST /api/auth/sign-in`

**Description:** Authenticate user with email and password. Sets secure session cookies.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "organizationId": "uuid",
    "role": "owner",
    "name": "John Doe"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Error Response (403):**
```json
{
  "error": "User profile not found. Please contact administrator."
}
```

---

### Sign Up

**Endpoint:** `POST /api/auth/sign-up`

**Description:** Public signup is disabled. Returns 403 error.

**Response (403):**
```json
{
  "error": "Public signup is disabled. Please contact administrator for onboarding."
}
```

---

### Sign Out

**Endpoint:** `POST /api/auth/sign-out`

**Description:** Sign out current user and clear session.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

### Auth Callback

**Endpoint:** `GET /auth/callback?code=AUTHORIZATION_CODE`

**Description:** OAuth callback endpoint for email confirmation.

**Response:** Redirects to `/dashboard` on success.

---

## Admin Endpoints

### Onboard User

**Endpoint:** `POST /api/admin/onboard-user`

**Authentication:** Requires super_admin role

**Description:** Create a new user and profile. Only super admins can call this endpoint.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "Jane Smith",
  "organizationId": "organization-uuid",
  "role": "manager"
}
```

**Valid Roles:**
- `super_admin` - Platform administrator
- `owner` - Organization owner
- `manager` - Organization manager

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User newuser@example.com created successfully with role manager",
  "user": {
    "id": "user-uuid",
    "email": "newuser@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized: No session found"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "Unauthorized: User role super_admin not allowed"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: email, password, name, organizationId, role"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Organization not found"
}
```

---

## Venue Endpoints

### List Venues

**Endpoint:** `GET /api/venues`

**Authentication:** Requires dashboard access (owner, manager, super_admin)

**Description:** Get all venues for the user's organization.

**Response (200 OK):**
```json
{
  "venues": [
    {
      "id": "uuid",
      "name": "Grand Ballroom",
      "type": "banquet",
      "capacity": 500,
      "organization_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Venue

**Endpoint:** `POST /api/venues`

**Authentication:** Requires owner role

**Request Body:**
```json
{
  "name": "Conference Hall",
  "type": "hotel",
  "capacity": 250
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "Conference Hall",
  "type": "hotel",
  "capacity": 250,
  "organization_id": "uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## Booking Endpoints

### List Bookings

**Endpoint:** `GET /api/bookings`

**Authentication:** Requires dashboard access

**Description:** Get all bookings for the user's organization.

**Query Parameters:**
- `venue_id` (optional) - Filter by venue
- `status` (optional) - Filter by status (confirmed, tentative, cancelled)
- `date_from` (optional) - Filter bookings from date
- `date_to` (optional) - Filter bookings to date

**Response (200 OK):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "venue_id": "uuid",
      "title": "Wedding Reception",
      "booking_date": "2024-06-15",
      "start_time": "18:00",
      "end_time": "23:00",
      "status": "confirmed",
      "customer_name": "John Smith",
      "customer_phone": "+1-XXX-XXX-XXXX",
      "notes": "Important notes",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Payment Endpoints

### List Payments

**Endpoint:** `GET /api/payments`

**Authentication:** Requires dashboard access

**Description:** Get all payments for the user's organization.

**Response (200 OK):**
```json
{
  "payments": [
    {
      "id": "uuid",
      "booking_id": "uuid",
      "amount": 5000.00,
      "method": "card",
      "paid_on": "2024-01-15",
      "status": "paid",
      "notes": "Payment notes",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Error Handling

All endpoints follow consistent error handling patterns:

**401 Unauthorized:**
- No valid session found
- User not authenticated

**403 Forbidden:**
- User lacks required role
- Insufficient permissions for resource

**404 Not Found:**
- Resource doesn't exist
- User doesn't have access to organization

**400 Bad Request:**
- Invalid input data
- Missing required fields

**500 Internal Server Error:**
- Unexpected server error
- Database error

### Error Response Format

```json
{
  "error": "Description of what went wrong"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Rate limiting may be added in future versions.

---

## Versioning

This API is at version 1.0. All endpoints are at `/api/v1/` or `/api/` (implied v1).

---

## Best Practices

1. **Always check authentication status** before making requests
2. **Handle error responses** gracefully in your client
3. **Use appropriate HTTP methods**: GET for retrieval, POST for creation, PUT for updates, DELETE for deletion
4. **Never expose sensitive data** in URLs (use POST body instead)
5. **Always validate input** on both client and server
6. **Use HTTPS** in production
7. **Keep session tokens secure** - never log them

---

## Support

For API issues or questions, refer to:
- ADMIN_SETUP.md for admin operations
- ENV_SETUP.md for environment configuration
- The middleware.ts and proxy.ts files for authentication flow details
