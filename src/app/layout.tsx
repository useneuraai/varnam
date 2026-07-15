import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
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
  "telephone": "+91 98765 43210",
  "email": "support@varnam.in",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12, Khader Nawaz Khan Road, Nungambakkam",
    "addressLocality": "Chennai",
    "addressRegion": "Tamil Nadu",
    "postalCode": "600006",
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
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
              `,
            }}
          />
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
