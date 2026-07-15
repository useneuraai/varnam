import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://varnam-invites.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/templates", "/login"],
      disallow: ["/dashboard", "/editor", "/admin", "/api", "/success", "/invite"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
