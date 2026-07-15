import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Varnam | Premium Cinematic Digital Wedding Invitations with RSVP",
  description: "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
  metadataBase: new URL("https://varnam-invites.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "digital wedding invitation",
    "online wedding invite",
    "cinematic wedding invitation",
    "premium wedding invite",
    "interactive wedding card",
    "luxury wedding card",
    "whatsapp wedding invitation",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Varnam | Premium Cinematic Digital Wedding Invitations with RSVP",
    description: "Create elegant digital invites with cinematic animation and music.",
    type: "website",
    url: "https://varnam-invites.vercel.app",
    siteName: "Varnam",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varnam - Premium Cinematic Wedding Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varnam | Premium Cinematic Wedding Invitations",
    description: "Create elegant digital invites with cinematic animation and music.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import SmoothScroll from "@/components/animations/SmoothScroll";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Varnam",
  "url": "https://varnam-invites.vercel.app",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 compatible browser",
  "description": "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
  "offers": {
    "@type": "Offer",
    "price": "799.00",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "category": "Signature Event License"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Varnam",
  "url": "https://varnam-invites.vercel.app",
  "logo": "https://varnam-invites.vercel.app/apple-touch-icon.png",
  "description": "Craft ultra-premium, interactive, and cinematic digital wedding invitations with online RSVP, slideshows, and custom music.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-98765-43210",
    "contactType": "customer service"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Varnam Wedding Invites",
  "image": "https://varnam-invites.vercel.app/og-image.png",
  "telephone": "+91 7200180268",
  "email": "support@varnam.in",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "115, Ekambaranathar Sannathi Street",
    "addressLocality": "Kanchipuram",
    "addressRegion": "Tamil Nadu",
    "postalCode": "631502",
    "addressCountry": "IN"
  },
  "priceRange": "₹₹"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Google Analytics */}
        {(() => {
          const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-85Y79K4YQE";
          return (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          );
        })()}
        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="bg-[#080708] text-[#fbf6df] selection:bg-[#d4a325] selection:text-[#080708]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
