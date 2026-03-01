import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/personal-info/", "/security/", "/payments/"],
    },
    sitemap: "https://accounts.fitbinary.com/sitemap.xml",
  };
}
