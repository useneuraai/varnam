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
  metadataBase: new URL("https://www.varnaminvites.store"),
  title: {
    default: "Varnam Invites | Premium Digital Wedding Invitations",
    template: "%s | Varnam Invites",
  },
  description:
    "Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation.",
  keywords: [
    "varnam invites",
    "varnam wedding invites",
    "varnaminvites.store",
    "varnam digital invite",
    "varnam invites store",
    "varnam invite",
    "varnam wedding cards",
    "Varnam Invites",
    "Varnam",
    "digital wedding invitation",
    "online wedding invitation",
    "wedding invitation website",
    "Indian wedding invitation",
    "digital wedding invite",
    "premium wedding invitation",
    "wedding website India",
    "Tamil wedding invitation website",
    "South Indian wedding invites",
    "WhatsApp wedding invitation",
    "interactive wedding invitation card",
    "luxury digital invites"
  ],
  alternates: {
    canonical: "https://www.varnaminvites.store/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] } : {}),
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.varnaminvites.store/",
    siteName: "Varnam Invites",
    title: "Varnam Invites | Premium Digital Wedding Invitations",
    description:
      "Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation.",
    images: [
      {
        url: "https://www.varnaminvites.store/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Varnam Invites - Premium Digital Wedding Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varnam Invites | Premium Digital Wedding Invitations",
    description:
      "Create beautiful digital wedding invitations and personal wedding websites with instant customization, background music, RSVP tracking, and Google Maps venue navigation.",
    images: ["https://www.varnaminvites.store/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico?v=5",
    shortcut: "/favicon.ico?v=5",
    apple: "/favicon.ico?v=5",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

import SmoothScroll from "@/components/animations/SmoothScroll";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Varnam Invites",
  alternateName: ["Varnam", "Varnam Digital Wedding Invitations"],
  url: "https://www.varnaminvites.store/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.varnaminvites.store/templates?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Varnam Invites",
  alternateName: ["Varnam Wedding App", "Varnam Digital Wedding Invitations"],
  url: "https://www.varnaminvites.store/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All",
  browserRequirements: "Requires HTML5 compatible browser",
  description: "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
  offers: {
    "@type": "Offer",
    price: "999.00",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    category: "Signature Event License"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Varnam Invites",
  alternateName: ["Varnam", "Varnam Digital Wedding Invitations"],
  url: "https://www.varnaminvites.store/",
  logo: "https://www.varnaminvites.store/logo.png",
  description: "Varnam Invites crafts premium digital wedding invitation websites for Indian weddings.",
  sameAs: ["https://www.instagram.com/varnaminvites"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@varnaminvites.store",
    areaServed: "IN",
    availableLanguage: ["English", "Tamil", "Hindi", "Telugu"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Varnam Invites",
  alternateName: ["Varnam", "Varnam Digital Wedding Invitations"],
  image: "https://www.varnaminvites.store/og-image.jpg",
  url: "https://www.varnaminvites.store/",
  email: "hello@varnaminvites.store",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kanchipuram",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Marcellus&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#080708] text-[#fbf6df] selection:bg-[#d4a325] selection:text-[#080708]"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
                strategy="lazyOnload"
              />
              <Script id="google-analytics" strategy="lazyOnload">
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
          <Script id="facebook-pixel" strategy="lazyOnload">
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
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
