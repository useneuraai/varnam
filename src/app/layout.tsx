import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
  openGraph: {
    title: "Varnam | Premium Cinematic Wedding Invitations",
    description: "Create elegant digital invites with cinematic animation and music.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import SmoothScroll from "@/components/animations/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${montserrat.variable} ${greatVibes.variable} antialiased`}
    >
      <body className="bg-[#080708] text-[#fbf6df] selection:bg-[#d4a325] selection:text-[#080708]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
