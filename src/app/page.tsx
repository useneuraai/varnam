import { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Varnam | Create Wedding Invitation Websites Online in Minutes",
  description: "Create your wedding invitation website online in minutes. Luxury 3D South Indian temple and mandapam designs with instant WhatsApp RSVP, scratch cards, and maps.",
  keywords: [
    "digital wedding invitation",
    "online wedding invite",
    "cinematic wedding invitation",
    "premium wedding invite",
    "interactive wedding card",
    "luxury wedding card",
    "whatsapp wedding invitation",
  ],
};

export default function HomePage() {
  return <LandingClient />;
}
