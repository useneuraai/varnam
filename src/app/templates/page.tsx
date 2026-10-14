import { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Wedding Invitation Templates | Varnam Invites",
  description:
    "Explore handcrafted digital wedding invitation templates by Varnam Invites. South Indian temple designs, palace mandapams, and floral themes with RSVP tracking, music, and Google Maps.",
  keywords: [
    "varnam invites templates",
    "varnam wedding cards",
    "varnam invites",
    "digital wedding invitation templates",
    "Indian wedding invitation websites",
    "wedding website templates",
    "online marriage invitation card",
  ],
  alternates: {
    canonical: "https://www.varnaminvites.store/templates",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Wedding Invitation Templates | Varnam Invites",
    description:
      "Explore handcrafted digital wedding invitation templates for Indian weddings with instant RSVP, music, and Google Maps.",
    url: "https://www.varnaminvites.store/templates",
    type: "website",
    images: [
      {
        url: "https://www.varnaminvites.store/og-image.jpg",
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
    images: ["https://www.varnaminvites.store/og-image.jpg"],
  },
};

export default function GalleryPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wedding Invitation Templates | Varnam Invites",
    description:
      "Explore handcrafted digital wedding invitation templates by Varnam Invites with RSVP tracking, music, and Google Maps.",
    url: "https://www.varnaminvites.store/templates",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: TEMPLATES.length,
      itemListElement: TEMPLATES.map((tpl, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: `${tpl.name} Digital Wedding Invitation`,
          description: tpl.description,
          url: `https://www.varnaminvites.store/templates/${tpl.slug}`,
          image: tpl.thumbnailUrl.startsWith("http")
            ? tpl.thumbnailUrl
            : `https://www.varnaminvites.store${tpl.thumbnailUrl}`,
          offers: {
            "@type": "Offer",
            price: tpl.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `https://www.varnaminvites.store/templates/${tpl.slug}`,
          },
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.varnaminvites.store/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Templates",
        item: "https://www.varnaminvites.store/templates",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GalleryClient />
    </>
  );
}
