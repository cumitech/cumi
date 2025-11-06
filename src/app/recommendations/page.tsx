import { Metadata } from "next";
import RecommendationsPageComponent from "@components/page-components/recommendations-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/recommendations", {
  title: "Recommended Tools & Services - CUMI Software Development",
  description: "Discover handpicked tools and services recommended by CUMI's expert team. Find the best web hosting, development tools, marketing platforms, and business solutions for your projects.",
  keywords: [
    "recommended tools",
    "software development tools",
    "web hosting recommendations",
    "development services",
    "business tools",
    "marketing platforms",
    "finance tools",
    "education platforms",
    "hosting services",
    "development frameworks",
    "project management tools",
    "design tools",
    "analytics platforms",
    "payment processors",
    "cloud services",
    "API tools",
    "database services",
    "monitoring tools",
    "deployment platforms",
    "collaboration tools",
    "productivity software",
    "security tools",
    "backup services",
    "domain registrars",
    "SSL certificates",
    "CDN services",
    "email marketing tools",
    "social media management",
    "content management systems",
    "e-commerce platforms"
  ],
  url: "https://cumi.dev/recommendations",
  alternates: {
    canonical: "https://cumi.dev/recommendations"
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Recommended Tools & Services"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "Software Development Tools Recommendations"
    }
  ],
  openGraph: {
    type: "website",
    title: "Recommended Tools & Services - CUMI Expert Picks",
    description: "Discover the best tools and services recommended by CUMI's software development experts. Handpicked solutions for web hosting, development, marketing, and business growth.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/recommendations"
  },
  twitter: {
    card: "summary_large_image",
    title: "Recommended Tools & Services - CUMI Expert Picks",
    description: "Discover the best tools and services recommended by CUMI's software development experts for your projects.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData('webpage', {
    name: "Recommended Tools & Services",
    description: "Handpicked tools and services recommended by CUMI's expert software development team",
    url: "https://cumi.dev/recommendations",
    mainEntity: {
      "@type": "ItemList",
      "name": "Recommended Tools & Services",
      "description": "Curated list of tools and services for software development, web hosting, marketing, and business growth"
    }
  })
  });
}

export default function RecommendationsPage() {
  return <RecommendationsPageComponent />;
}