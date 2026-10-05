import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Browse Wedding Invitation Templates | Varnam",
  description: "Explore our collection of cinematic, interactive digital wedding invitation templates. Choose from Classic and Premium designs crafted with luxury typography, music, and smooth motion.",
  keywords: ["wedding templates", "digital wedding invitation", "cinematic invitation", "rsvp templates"],
};

export default function GalleryPage() {
  return <GalleryClient />;
}
