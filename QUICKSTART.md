# Quick Start Guide - Madadwala with MongoDB & OTP Auth

## 1️⃣ Prerequisites
- Node.js 18+
- MongoDB Atlas Account (free tier available)
- Gmail Account with 2FA enabled

## 2️⃣ Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a new project
4. Create a cluster (M0 free tier)
5. Create a database user with password
6. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy: `mongodb+srv://username:password@cluster.mongodb.net/madadwala?retryWrites=true&w=majority`

## 3️⃣ Set Up Gmail SMTP

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Google generates 16-character password
5. Copy this password (spaces are normal)

## 4️⃣ Configure Environment Variables

Create `.env.local` in project root:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/madadwala?retryWrites=true&w=majority

# JWT Secret (generate random)
JWT_SECRET=your-super-secret-key-change-in-production

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Optional
EMAIL_FROM=noreply@madadwala.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generate JWT_SECRET quickly:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 5️⃣ Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 6️⃣ Test Login Flow

1. Go to http://localhost:3000/login
2. Enter your email
3. Select "Customer" or "Service Provider"
4. Click "Send OTP"
5. Check your email for 6-digit code
6. Enter code and click "Login"
7. Should redirect to home or provider dashboard

## 🎯 What Works Now

✅ Email + OTP Authentication  
✅ Role-based Login (Customer/Provider)  
✅ JWT Session Management  
✅ MongoDB User Storage  
✅ Admin Dashboard (basic)  
✅ Services Listing  
✅ Provider Search  

## ⚠️ What Needs Work

- File upload integration (Vercel Blob/S3)
- Booking system
- Chat/messaging
- Reviews system
- Payment integration
- More API endpoints for other collections

## 🐛 Troubleshooting

### OTP not sending?
- Check GMAIL_USER and GMAIL_APP_PASSWORD
- Verify Gmail 2FA is enabled
- Check spam folder
- Check browser console for error messages

### Can't connect to MongoDB?
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas settings
- Try connection string in MongoDB Compass

### Login redirects to login page?
- Clear browser cookies
- Check console for errors
- Verify JWT_SECRET is set

## 📚 Detailed Docs

- Full setup guide: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- What changed: [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
- API Docs: [API_DOCS.md](./API_DOCS.md) (coming soon)

## 🚀 Next Steps

1. Test the OTP flow thoroughly
2. Implement file storage for images
3. Create other MongoDB collections
4. Build booking system
5. Deploy to Vercel

---

**Questions?** Check the detailed guides in the repo root.
