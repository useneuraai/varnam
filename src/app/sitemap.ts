import { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "varnam-invites.vercel.app";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic template details routes
  const templateRoutes: MetadataRoute.Sitemap = TEMPLATES.map((tpl) => ({
    url: `${baseUrl}/templates/${tpl.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...templateRoutes];
}
