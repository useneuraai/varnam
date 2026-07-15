import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "varnam-invites.vercel.app";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/templates", "/login"],
      disallow: ["/dashboard", "/editor", "/admin", "/api", "/success", "/invite"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
