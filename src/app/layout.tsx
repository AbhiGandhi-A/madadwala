import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Madadwala - Plumber Electrician India | ₹30 Mein Unlock",
  description: "Find local pros instantly. Plumber electrician cleaning anywhere India. Ek call mein madad – 10,000+ verified professionals.",
  keywords: "plumber near me, electrician near me, cleaning service india, madadwala, home services india",
  openGraph: {
    title: "Madadwala – Ek Call Mein Madad!",
    description: "India ka #1 local services app. Plumber, Electrician, Cleaning – ₹30 mein unlock karo.",
    url: "https://madadwala.in",
    siteName: "Madadwala",
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madadwala – Ek Call Mein Madad!",
    description: "10,000+ verified pros. ₹30 unlock. 24/7 service.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Madadwala",
              description: "India ka local services app – Plumber, Electrician, Cleaning",
              url: "https://madadwala.in",
              telephone: "+91-9999999999",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
              areaServed: "IN",
              priceRange: "₹30-₹40",
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
