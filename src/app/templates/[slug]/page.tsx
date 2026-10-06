import { Metadata } from "next";
import TemplatePreviewClient from "./TemplatePreviewClient";
import { getTemplateBySlug } from "@/lib/templates";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Template Not Found | Varnam Invites",
      description: "The digital wedding invitation template you are trying to preview does not exist.",
    };
  }

  const cleanName = template.name
    .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "")
    .trim();

  const title = `${cleanName} - Digital Wedding Invitation Website | Varnam Invites`;
  const description = `${template.description} Customize online with instant RSVP, photo galleries, maps & music.`;
  const canonicalUrl = `https://www.varnaminvites.store/templates/${slug}`;
  const imageUrl = template.thumbnailUrl.startsWith("http")
    ? template.thumbnailUrl
    : `https://www.varnaminvites.store${template.thumbnailUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: `${cleanName} Wedding Invitation Website`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    keywords: [
      `${cleanName} wedding invitation`,
      "digital wedding invitation",
      "Indian wedding invitation website",
      template.category,
      "online wedding card",
      "interactive wedding website",
    ],
  };
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const template = getTemplateBySlug(slug);

  const productSchema = template
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${template.name} Digital Wedding Invitation`,
        description: template.description,
        image: template.thumbnailUrl.startsWith("http")
          ? template.thumbnailUrl
          : `https://www.varnaminvites.store${template.thumbnailUrl}`,
        brand: {
          "@type": "Brand",
          name: "Varnam Invites",
        },
        offers: {
          "@type": "Offer",
          url: `https://www.varnaminvites.store/templates/${slug}`,
          priceCurrency: "INR",
          price: template.price,
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <TemplatePreviewClient slug={slug} />
    </>
  );
}
