import { MetadataRoute } from "next";
import { SITE_URL } from "@constants/api-url";

/**
 * robots.txt for SEO.
 * Do NOT disallow /_next/ — Googlebot needs JS/CSS to render the page.
 * @see https://developers.google.com/search/docs/essentials/technical
 * @see https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero
 */
export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/admin/",
          "/_preview/",
          "/auth/",
        ],
      },
    ],
  };
}