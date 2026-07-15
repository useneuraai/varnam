import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Browse Premium Wedding Templates | Varnam",
  description: "Explore our collection of cinematic, interactive digital wedding invitation templates. Choose from Traditional Tamil, Floral Luxury, Modern Minimal, Royal Heritage, and more.",
  keywords: ["wedding templates", "digital wedding invitation", "cinematic invitation", "rsvp templates"],
};

export default function GalleryPage() {
  return <GalleryClient />;
}
