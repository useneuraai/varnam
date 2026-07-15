import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://varnam.wedding";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/templates", "/login"],
      disallow: ["/dashboard", "/editor", "/admin", "/api", "/success", "/invite"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
