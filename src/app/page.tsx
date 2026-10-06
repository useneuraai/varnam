import { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Varnam Invites | Premium Digital Wedding Invitations",
  description:
    "Create beautiful, interactive digital wedding invitations with Varnam Invites. Premium wedding invitation websites for Indian weddings with instant WhatsApp RSVP, luxury 3D temple animations, photo galleries, and Google Maps venue navigation.",
  alternates: {
    canonical: "https://www.varnaminvites.store",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function HomePage() {
  return <LandingClient />;
}
