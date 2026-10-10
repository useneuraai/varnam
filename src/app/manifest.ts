import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Varnam Invites | Digital Wedding Invitations",
    short_name: "Varnam Invites",
    description: "Premium Digital Wedding Invitations and Interactive Wedding Websites",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b3811b",
    icons: [
      {
        src: "/favicon.ico?v=5",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
