# Firebase to MongoDB Migration Guide

This project has been migrated from Firebase to MongoDB with email-based OTP authentication using SMTP.

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

### MongoDB Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/madadwala?retryWrites=true&w=majority
```
- Get this from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster and user
- Copy the connection string and replace username/password

### JWT Secret (for OTP sessions)
```
JWT_SECRET=your-secure-random-string-min-32-characters
```
- Can be any secure random string (minimum 32 characters recommended)
- Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Gmail SMTP Setup
```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**To get Gmail App Password:**
1. Enable 2FA on your Google Account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Use this password in `GMAIL_APP_PASSWORD`

### Optional Email Configuration
```
EMAIL_FROM=noreply@madadwala.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema

The application automatically creates the following MongoDB collections:

### users
```json
{
  "_id": "ObjectId",
  "uid": "unique-user-id",
  "email": "user@example.com",
  "password": "hashed-password",
  "displayName": "User Name",
  "profileImage": "url-to-image",
  "role": "customer|provider|admin",
  "status": "active|suspended",
  "verified": false,
  "serviceCategories": ["service-id-1"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### otps
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "otp": "123456",
  "role": "customer|provider",
  "expiresAt": "2024-01-01T00:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### services
```json
{
  "_id": "ObjectId",
  "id": "service-id",
  "name": "Service Name",
  "description": "Service description",
  "category": "category-name",
  "icon": "icon-url",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Authentication Flow

### Login Process
1. User enters email on login page
2. Select role: "Customer" or "Service Provider"
3. Click "Send OTP"
4. OTP is sent to email via SMTP (30-minute expiry)
5. User enters 6-digit OTP
6. System creates JWT session
7. User is redirected to:
   - **Customer** → `/home` (customer dashboard)
   - **Provider** → `/provider/register` (provider onboarding)

### API Endpoints

#### Send OTP
```
POST /api/auth/send-otp
{
  "email": "user@example.com",
  "role": "customer|provider"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456",
  "role": "customer|provider"
}
```

#### Get Current User
```
GET /api/auth/me
```
Returns current authenticated user (requires valid JWT token in cookie)

#### Logout
```
POST /api/auth/logout
```

## File Storage

Currently, file upload functions return placeholder URLs. To enable actual file uploads, integrate one of these services:

### Option 1: Vercel Blob (Recommended)
```bash
npm install @vercel/blob
```

### Option 2: AWS S3
```bash
npm install @aws-sdk/client-s3
```

### Option 3: Cloudinary
```bash
npm install cloudinary next-cloudinary
```

Update `src/lib/storage-service.ts` with your chosen provider.

## Running the Application

```bash
# Install dependencies
npm install

# Set environment variables in .env.local
# Copy .env.example and fill in your values

# Run development server
npm run dev

# Open http://localhost:3000
```

## Seed Services Data

To populate initial services:

```
GET http://localhost:3000/api/seed
```

This will create sample services in MongoDB if they don't already exist.

## Key Changes from Firebase

| Feature | Firebase | MongoDB |
|---------|----------|---------|
| Auth | Firebase Auth | JWT-based OTP |
| Database | Firestore | MongoDB |
| Email | Firebase Email Links | SMTP (Gmail) |
| File Storage | Firebase Storage | Placeholder (TODO) |
| Sessions | Firebase Auth Tokens | HTTP-only JWT Cookies |

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` is correct
- Check if MongoDB Atlas IP whitelist includes your IP
- Test connection: `mongodb+srv://...@cluster.mongodb.net/` in MongoDB Atlas

### OTP Not Sending
- Verify Gmail credentials are correct
- Check if Gmail 2FA and App Password are set up
- Check console logs for detailed error messages
- Verify `EMAIL_FROM` is a valid email address

### Authentication Issues
- Clear cookies in browser dev tools
- Check JWT_SECRET is set and consistent
- Verify user exists in MongoDB users collection

## Next Steps

1. Configure all environment variables
2. Test OTP flow: `/login` → send OTP → verify
3. Integrate file storage for profile images
4. Implement booking system with MongoDB
5. Set up chat functionality
6. Deploy to Vercel

## Support

For issues or questions:
- Check MongoDB Atlas docs: [mongodb.com/docs](https://www.mongodb.com/docs)
- Gmail SMTP: [support.google.com/accounts](https://support.google.com/accounts)
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)
