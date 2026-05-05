# API Documentation

## Authentication Endpoints

### POST /api/auth/send-otp
Send OTP to user's email

**Request:**
```json
{
  "email": "user@example.com",
  "role": "customer|provider"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully to user@example.com"
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

**Response (500):**
```json
{
  "success": false,
  "error": "Failed to send OTP"
}
```

---

### POST /api/auth/verify-otp
Verify OTP and create session

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "role": "customer|provider"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "uid": "user-id",
    "email": "user@example.com",
    "role": "customer|provider",
    "displayName": "User Name"
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

**Response (500):**
```json
{
  "success": false,
  "error": "Failed to verify OTP"
}
```

**Notes:**
- Sets JWT token in HTTP-only cookie
- User is automatically logged in after this call
- OTP expires after 30 minutes

---

### GET /api/auth/me
Get current authenticated user

**Headers:**
```
Cookie: jwt=token...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "user-id",
      "email": "user@example.com",
      "displayName": "User Name",
      "role": "customer|provider|admin",
      "status": "active|suspended",
      "verified": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

---

### POST /api/auth/logout
Logout and clear session

**Headers:**
```
Cookie: jwt=token...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Notes:**
- Clears JWT cookie
- All subsequent requests require new login

---

## User Endpoints

### GET /api/users
Get all users (with optional filtering)

**Query Parameters:**
- `role` (optional): `customer|provider|admin`

**Examples:**
```
GET /api/users
GET /api/users?role=customer
GET /api/users?role=provider
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "uid": "user-1",
      "email": "customer@example.com",
      "displayName": "Customer Name",
      "role": "customer",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Notes:**
- Password field is excluded from response
- Requires admin authentication (recommended)

---

### PATCH /api/users/[id]
Update user details

**URL Parameter:**
- `id`: user UID

**Request:**
```json
{
  "status": "active|suspended",
  "verified": true,
  "displayName": "Updated Name"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "displayName": "Updated Name",
    "status": "suspended",
    "verified": true
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## Service Endpoints

### GET /api/services
Get all services

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service-mongo-id",
      "id": "plumbing",
      "name": "Plumbing",
      "description": "Water pipe repairs and installation",
      "category": "maintenance",
      "icon": "pipe.svg",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/services/[id]
Get service details

**URL Parameter:**
- `id`: service ID (MongoDB _id or custom id)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "service-mongo-id",
    "id": "plumbing",
    "name": "Plumbing",
    "description": "Water pipe repairs and installation",
    "category": "maintenance",
    "icon": "pipe.svg"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Service not found"
}
```

---

## Provider Endpoints

### GET /api/providers
Get providers (optionally filtered by service)

**Query Parameters:**
- `serviceId` (optional): Filter providers offering specific service

**Examples:**
```
GET /api/providers
GET /api/providers?serviceId=plumbing
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "uid": "provider-1",
      "email": "provider@example.com",
      "displayName": "Provider Name",
      "role": "provider",
      "verified": true,
      "serviceCategories": ["plumbing", "electrical"],
      "experience": "5 years",
      "rating": 4.8,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## Seed Endpoint

### GET /api/seed
Initialize services data

**Response (200 - New):**
```json
{
  "success": true,
  "message": "Services seeded successfully",
  "count": 12,
  "services": [...]
}
```

**Response (200 - Already Seeded):**
```json
{
  "success": true,
  "message": "Services already seeded",
  "count": 12
}
```

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (invalid data)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

---

## Authentication

### JWT Token
- Stored in HTTP-only cookie named `jwt`
- Automatically sent with all requests
- Valid for 7 days (default)
- Cannot be accessed by JavaScript (security feature)

### Checking Authentication
Use `GET /api/auth/me` to verify if user is authenticated

```javascript
const response = await fetch('/api/auth/me', {
  credentials: 'include'
});

if (response.ok) {
  const data = await response.json();
  console.log('User:', data.data.user);
} else {
  console.log('Not authenticated');
}
```

---

## Database Schema Reference

### Users Collection
```javascript
{
  "_id": ObjectId,           // MongoDB ID
  "uid": "unique-string",    // Custom user ID
  "email": "user@example.com",
  "password": "bcrypt-hash", // Never returned in API
  "displayName": "User Name",
  "profileImage": "url",
  "role": "customer|provider|admin",
  "status": "active|suspended",
  "verified": false,
  "serviceCategories": ["service-id"],
  "experience": "5 years",   // Provider only
  "rating": 4.8,             // Provider only
  "createdAt": Date,
  "updatedAt": Date
}
```

### OTPs Collection
```javascript
{
  "_id": ObjectId,
  "email": "user@example.com",
  "otp": "123456",
  "role": "customer|provider",
  "expiresAt": Date,
  "createdAt": Date
}
```

### Services Collection
```javascript
{
  "_id": ObjectId,
  "id": "plumbing",
  "name": "Plumbing",
  "description": "Service description",
  "category": "maintenance",
  "icon": "icon-url",
  "createdAt": Date
}
```

---

## Rate Limiting (Recommended)

For production, implement rate limiting on:
- `POST /api/auth/send-otp` - 5 requests per email per hour
- `POST /api/auth/verify-otp` - 10 attempts per email per 30 minutes
- All endpoints - 100 requests per IP per minute

---

## CORS

All endpoints accept requests from:
- Same origin
- Cross-origin with credentials (cookies)

---

## Examples

### Complete Login Flow

```javascript
// Step 1: Send OTP
const sendOTPResponse = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    role: 'customer'
  })
});

// Step 2: User enters OTP from email...

// Step 3: Verify OTP
const verifyResponse = await fetch('/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important: send cookies
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456',
    role: 'customer'
  })
});

if (verifyResponse.ok) {
  // Redirect to home
  window.location.href = '/home';
}
```

### Get Current User

```javascript
const response = await fetch('/api/auth/me', {
  credentials: 'include' // Important: send cookies
});

if (response.ok) {
  const { data } = await response.json();
  console.log('Logged in as:', data.user.displayName);
} else {
  console.log('Not logged in');
}
```

### List All Providers for a Service

```javascript
const response = await fetch('/api/providers?serviceId=plumbing');
const { data } = await response.json();
console.log('Available plumbers:', data);
```

---

## Testing with cURL

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","role":"customer"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","otp":"123456","role":"customer"}'

# Get current user
curl http://localhost:3000/api/auth/me \
  -b cookies.txt

# Get all services
curl http://localhost:3000/api/services

# Get providers for service
curl "http://localhost:3000/api/providers?serviceId=plumbing"
```

---

Last Updated: May 6, 2026
API Version: 1.0.0
