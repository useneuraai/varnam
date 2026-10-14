import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In to Your Wedding Studio | Varnam Invites",
  description:
    "Sign in to your Varnam Invites wedding studio to manage your digital wedding invitations, monitor live guest RSVPs, and edit event details.",
  keywords: [
    "varnam invites login",
    "wedding studio login",
    "varnam sign in",
    "digital wedding invitation dashboard",
    "wedding website login",
  ],
  alternates: {
    canonical: "https://www.varnaminvites.store/login",
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
    title: "Sign In to Your Wedding Studio | Varnam Invites",
    description:
      "Access your personalized wedding invitations, live RSVP attendance tracker, and audio settings in your Varnam Studio.",
    url: "https://www.varnaminvites.store/login",
    type: "website",
    images: [
      {
        url: "https://www.varnaminvites.store/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Varnam Invites - Wedding Studio Access",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In to Your Wedding Studio | Varnam Invites",
    description:
      "Sign in to access your digital wedding invitation studio and live guest attendance tracker.",
    images: ["https://www.varnaminvites.store/og-image.jpg"],
  },
};

export default function LoginPage() {
  const loginSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Sign In | Varnam Invites Wedding Studio",
    url: "https://www.varnaminvites.store/login",
    description:
      "Sign in to access your personalized wedding templates, live RSVP attendance tracker, and custom audio players in one place.",
    isPartOf: {
      "@type": "WebSite",
      name: "Varnam Invites",
      url: "https://www.varnaminvites.store/",
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
        name: "Sign In",
        item: "https://www.varnaminvites.store/login",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loginSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LoginClient />
    </>
  );
}
