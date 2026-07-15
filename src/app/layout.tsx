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
  title: "Varnam | Premium Cinematic Wedding Invitations",
  description: "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
  metadataBase: new URL("https://varnam.wedding"),
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
    title: "Varnam | Premium Cinematic Wedding Invitations",
    description: "Create elegant digital invites with cinematic animation and music.",
    type: "website",
    url: "https://varnam.wedding",
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
  maximumScale: 1,
};

import SmoothScroll from "@/components/animations/SmoothScroll";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Varnam",
  "url": "https://varnam.wedding",
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
      </head>
      <body className="bg-[#080708] text-[#fbf6df] selection:bg-[#d4a325] selection:text-[#080708]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
