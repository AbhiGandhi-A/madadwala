# 🔧 Madadwala – India's Local Services App

> **Ek Call Mein Madad!** — Find Plumbers, Electricians, Cleaning services across India.

## 🚀 1-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/madadwala)

## 🛠 Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
```

## 📁 Project Structure

```
madadwala/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # SEO metadata + fonts
│   │   ├── page.tsx        # Main page (assembles all sections)
│   │   └── globals.css     # Custom CSS variables + animations
│   ├── components/
│   │   ├── Navbar.tsx          # Fixed nav + city selector + mobile menu
│   │   ├── Hero.tsx            # Full-viewport hero + search + stats
│   │   ├── Categories.tsx      # 4x3 service grid with hover effects
│   │   ├── HowItWorks.tsx      # 3-step process explanation
│   │   ├── Testimonials.tsx    # Auto-scrolling carousel
│   │   ├── Pricing.tsx         # 3-tier pricing cards
│   │   ├── ProCTA.tsx          # Professional registration section
│   │   ├── Footer.tsx          # Full footer with links
│   │   └── MobileBottomNav.tsx # Mobile fixed bottom nav
│   └── lib/
│       └── utils.ts        # cn() utility function
├── public/
│   ├── manifest.json       # PWA manifest
│   └── robots.txt
├── tailwind.config.ts      # Custom colors + animations
├── next.config.js          # Image optimization config
└── vercel.json             # Vercel deployment config
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#F59E0B` (Amber/Orange) |
| Accent | `#10B981` (Green) |
| Dark | `#1F2937` |
| Background | `#F8FAFC` |
| Display Font | Baloo 2 |
| Body Font | Noto Sans |

## 📱 Features

- ✅ **Mobile-first** responsive design
- ✅ **Fixed navbar** with city selector + hamburger menu
- ✅ **Hero** with search bar, animated stats, gradient bg
- ✅ **12 service categories** with hover animations
- ✅ **3-step how-it-works** section
- ✅ **Auto-scrolling testimonials** carousel
- ✅ **3-tier pricing** cards
- ✅ **Pro registration** CTA section
- ✅ **PWA ready** with manifest.json
- ✅ **SEO optimized** with metadata + JSON-LD schema
- ✅ **Scroll-triggered animations** throughout
- ✅ **Mobile bottom nav** for mobile users

## 🌐 Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Deploy — no env vars needed!

### Manual Build
```bash
npm run build
npm start
```

## 📞 Support
madadwala.in · support@madadwala.in · +91 99999 99999
