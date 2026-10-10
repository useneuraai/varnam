import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/editor/", "/api/", "/success/", "/invite/"],
    },
    sitemap: "https://www.varnaminvites.store/sitemap.xml",
    host: "https://www.varnaminvites.store",
  };
}
