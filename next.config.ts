import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Automatically bridges private Vercel environment variables to client runtime
    SUPABASE_URL:
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    SITE_URL:
      process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.varnaminvites.store",
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_PUBLIC_SITE_URL:
      process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.varnaminvites.store",
  },
  async redirects() {
    return [
      {
        source: "/templates/kadhal-editorial",
        destination: "/templates/classical-gold",
        permanent: true,
      },
      {
        source: "/templates/kalyana-mandapam",
        destination: "/templates/royal-palace",
        permanent: true,
      },
      {
        source: "/templates/konaseema-kalyanam",
        destination: "/templates/heritage-courtyard",
        permanent: true,
      },
      {
        source: "/templates/kovil-thirumanam",
        destination: "/templates/temple-heritage",
        permanent: true,
      },
      {
        source: "/templates/mayura-palace",
        destination: "/templates/palace-garden",
        permanent: true,
      },
      {
        source: "/templates/theertha-mandapam",
        destination: "/templates/lotus-swans",
        permanent: true,
      },
      {
        source: "/templates/kamalam-kalyanam",
        destination: "/templates/crimson-red",
        permanent: true,
      },
      {
        source: "/templates/marigold-vizha",
        destination: "/templates/marigold-festive",
        permanent: true,
      },
      {
        source: "/editor/kadhal-editorial",
        destination: "/editor/classical-gold",
        permanent: true,
      },
      {
        source: "/editor/kalyana-mandapam",
        destination: "/editor/royal-palace",
        permanent: true,
      },
      {
        source: "/editor/konaseema-kalyanam",
        destination: "/editor/heritage-courtyard",
        permanent: true,
      },
      {
        source: "/editor/kovil-thirumanam",
        destination: "/editor/temple-heritage",
        permanent: true,
      },
      {
        source: "/editor/mayura-palace",
        destination: "/editor/palace-garden",
        permanent: true,
      },
      {
        source: "/editor/theertha-mandapam",
        destination: "/editor/lotus-swans",
        permanent: true,
      },
      {
        source: "/editor/kamalam-kalyanam",
        destination: "/editor/crimson-red",
        permanent: true,
      },
      {
        source: "/editor/marigold-vizha",
        destination: "/editor/marigold-festive",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(svg|png|jpg|jpeg|webp|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
