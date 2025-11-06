import { Metadata } from "next";
import CategoriesPageComponent from "@components/page-components/categories-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/categories", {
  title: "Categories - CUMI Technology Blog Topics",
  description: "Explore CUMI's technology blog posts organized by categories including software development, web development, mobile app development, digital transformation, and programming topics.",
  keywords: [
    "technology blog categories",
    "software development topics",
    "web development categories",
    "mobile app development topics",
    "programming categories",
    "digital transformation topics",
    "technology articles",
    "programming tutorials",
    "software engineering topics",
    "API development categories",
    "database design topics",
    "user experience design categories",
    "responsive web design topics",
    "e-commerce development categories",
    "cloud solutions topics",
    "DevOps categories",
    "business automation topics",
    "tech industry insights",
    "development best practices",
    "coding tutorials"
  ],
  url: "https://cumi.dev/categories",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Blog Categories"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Blog Topics"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Technology Blog Categories",
    description: "Explore our technology blog posts organized by categories covering software development and digital transformation.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/categories"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Technology Blog Categories",
    description: "Explore our technology blog posts organized by categories covering software development and digital transformation.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Technology Blog Categories",
    "description": "Technology blog posts organized by categories and topics",
    "url": "https://cumi.dev/categories",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Blog Categories",
      "description": "Collection of technology topics and categories"
    }
  }
  });
}

export default function CategoriesPage() {
  return <CategoriesPageComponent />;
}

