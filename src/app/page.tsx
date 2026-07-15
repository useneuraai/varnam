import { Metadata } from "next";
import LandingClient from "./LandingClient";

export const metadata: Metadata = {
  title: "Varnam | Premium Cinematic Wedding Invitations",
  description: "Craft ultra-premium, interactive, and cinematic digital wedding invitations. Exquisite storytelling for your special day, inspired by luxury brands.",
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
