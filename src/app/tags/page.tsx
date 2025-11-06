import { Metadata } from "next";
import TagsPageComponent from "@components/page-components/tags-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/tags", {
  title: "Tags - CUMI Technology Blog Topics",
  description: "Browse all technology blog post tags and topics on CUMI's blog. Find articles by software development, web development, mobile app development, digital transformation, and programming topics.",
  keywords: [
    "technology blog tags",
    "software development topics",
    "web development tags",
    "mobile app development topics",
    "programming tags",
    "digital transformation topics",
    "technology article tags",
    "programming tutorials",
    "software engineering topics",
    "API development tags",
    "database design topics",
    "user experience design tags",
    "responsive web design topics",
    "e-commerce development tags",
    "cloud solutions topics",
    "DevOps tags",
    "business automation topics",
    "tech industry insights",
    "development best practices",
    "coding tutorials"
  ],
  url: "https://cumi.dev/tags",
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Blog Tags"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Blog Topics"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Technology Blog Tags",
    description: "Browse our technology blog tags and topics covering software development and digital transformation.",
    images: [defaultImages[1], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/tags"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Technology Blog Tags",
    description: "Browse our technology blog tags and topics covering software development and digital transformation.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Technology Blog Tags",
    "description": "Technology blog tags and topics for easy content discovery",
    "url": "https://cumi.dev/tags",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Blog Tags",
      "description": "Collection of technology topics and tags"
    }
  }
  });
}

export default function TagsPage() {
  return <TagsPageComponent />;
}

