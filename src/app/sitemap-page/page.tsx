import { Metadata } from "next";
import SitemapPageComponent from "@components/page-components/sitemap-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/sitemap-page", {
  title: "Application Sitemap - CUMI Software Development Platform",
  description: "Complete overview of all pages, routes, and API endpoints in the CUMI platform. Navigate through our comprehensive application structure including public pages, dashboards, and API documentation.",
  keywords: [
    "sitemap",
    "application structure",
    "website navigation",
    "API endpoints",
    "dashboard pages",
    "public pages",
    "authentication pages",
    "admin interface",
    "learning management system",
    "creator dashboard",
    "student dashboard",
    "software development platform",
    "web application structure",
    "site navigation",
    "page directory",
    "route overview",
    "API documentation",
    "platform architecture",
    "user interface pages",
    "content management",
    "course management",
    "blog management",
    "project management",
    "event management",
    "user management",
    "referral system",
    "contact system",
    "authentication system",
    "mobile app pages",
    "responsive design pages"
  ],
  url: "https://cumi.dev/sitemap-page",
  alternates: {
    canonical: "https://cumi.dev/sitemap-page"
  },
  image: defaultImages[2],
  images: [
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Application Sitemap - Complete Platform Overview"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Platform Structure and Navigation"
    }
  ],
  openGraph: {
    type: "website",
    title: "Application Sitemap - CUMI Platform Structure",
    description: "Explore the complete structure of the CUMI software development platform. Navigate through all public pages, dashboards, API endpoints, and system components.",
    images: [defaultImages[2], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/sitemap-page"
  },
  twitter: {
    card: "summary_large_image",
    title: "Application Sitemap - CUMI Platform Overview",
    description: "Complete guide to all pages, routes, and API endpoints in the CUMI software development platform.",
    images: [defaultImages[2]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData('webpage', {
    name: "Application Sitemap",
    description: "Complete overview of all pages, routes, and API endpoints in the CUMI platform",
    url: "https://cumi.dev/sitemap-page",
    mainEntity: {
      "@type": "ItemList",
      "name": "CUMI Platform Pages",
      "description": "Comprehensive list of all pages, dashboards, and API endpoints in the CUMI software development platform"
    }
  })
  });
}

export default function SitemapPage() {
  return <SitemapPageComponent />;
}