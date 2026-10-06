import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Wedding Invitation Templates | Varnam Invites",
  description:
    "Explore handcrafted digital wedding invitation templates for Indian weddings. Choose from South Indian temple designs, palace mandapams, and floral themes with RSVP tracking, music, and Google Maps.",
  alternates: {
    canonical: "https://www.varnaminvites.store/templates",
  },
  openGraph: {
    title: "Wedding Invitation Templates | Varnam Invites",
    description:
      "Explore handcrafted digital wedding invitation templates for Indian weddings with instant RSVP, music, and Google Maps.",
    url: "https://www.varnaminvites.store/templates",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Varnam Invites - Wedding Invitation Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedding Invitation Templates | Varnam Invites",
    description:
      "Explore handcrafted digital wedding invitation templates for Indian weddings.",
    images: ["/og-image.jpg"],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
