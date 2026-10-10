import { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Varnam Invites | Premium Digital Wedding Invitations",
  description:
    "Create beautiful, interactive digital wedding invitations with Varnam Invites. Premium wedding invitation websites for Indian weddings with instant WhatsApp RSVP, luxury 3D temple animations, photo galleries, and Google Maps venue navigation.",
  keywords: [
    "varnam invites",
    "varnam wedding invites",
    "varnaminvites.store",
    "varnam digital invite",
    "varnam invites store",
    "varnam",
    "Varnam Invites",
    "digital wedding invitation",
    "online wedding invitation",
    "wedding website India",
  ],
  alternates: {
    canonical: "https://www.varnaminvites.store/",
  },
};

export default function HomePage() {
  return <LandingClient />;
}
