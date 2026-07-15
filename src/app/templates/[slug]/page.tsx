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
      title: "Template Not Found | Varnam",
      description: "The digital wedding invitation template you are trying to preview does not exist.",
    };
  }

  const cleanName = template.name.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();

  return {
    title: `${cleanName} - Digital Wedding Invitation Template | Varnam`,
    description: template.description,
    keywords: [
      "wedding template",
      "digital wedding invitation",
      "cinematic invitation",
      cleanName,
      template.category,
      template.religion,
    ],
  };
}

export default async function TemplatePreviewPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <TemplatePreviewClient slug={slug} />;
}
