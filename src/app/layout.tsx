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
    "Create beautiful, interactive digital wedding invitations with Varnam Invites. Premium wedding invitation websites for Indian weddings, designed to share beautifully with family and friends.",
  keywords: [
    "Varnam Invites",
    "Varnam",
    "digital wedding invitation",
    "online wedding invitation",
    "wedding invitation website",
    "Indian wedding invitation",
    "digital wedding invite",
    "premium wedding invitation",
    "wedding website India",
  ],
  alternates: {
    canonical: "https://www.varnaminvites.store",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://www.varnaminvites.store",
    siteName: "Varnam Invites",
    title: "Varnam Invites | Premium Digital Wedding Invitations",
    description:
      "Premium interactive digital wedding invitation websites for modern Indian weddings.",
    images: [
      {
        url: "/og-image.jpg",
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
      "Premium interactive digital wedding invitations for Indian weddings.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
  url: "https://www.varnaminvites.store",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.varnaminvites.store/templates?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Varnam Invites",
  "url": "https://www.varnaminvites.store",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires HTML5 compatible browser",
  "description": "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
  "offers": {
    "@type": "Offer",
    "price": "999.00",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "category": "Signature Event License"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Varnam Invites",
  alternateName: ["Varnam", "Varnam Wedding Invites"],
  url: "https://www.varnaminvites.store",
  logo: "https://www.varnaminvites.store/logo.png",
  description: "Premium digital wedding invitation websites for Indian weddings.",
  sameAs: ["https://www.instagram.com/varnaminvites"],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 7200180268",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Tamil", "Hindi", "Telugu"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Varnam Wedding Invites",
  "image": "https://www.varnaminvites.store/og-image.jpg",
  "telephone": "+91 7200180268",
  "email": "hello@varnaminvites.store",
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
      suppressHydrationWarning
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Marcellus&family=Ramabhadra&family=Suranna&display=swap"
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
