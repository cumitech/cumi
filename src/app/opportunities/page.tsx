import { Metadata } from "next";
import OpportunitiesPageComponent from "@components/page-components/opportunities-page.component";
import { generatePageMetadata, defaultImages } from "../../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Opportunities - CUMI Career Opportunities & Job Openings",
  description: "Explore career opportunities at CUMI. Join our software development team with positions in web development, mobile app development, cloud solutions, and digital transformation roles.",
  keywords: [
    "software development jobs",
    "web development careers",
    "mobile app development positions",
    "programming jobs",
    "technology careers",
    "software engineering jobs",
    "full-stack developer positions",
    "frontend developer jobs",
    "backend developer careers",
    "API development positions",
    "database designer jobs",
    "user experience designer careers",
    "responsive web design positions",
    "e-commerce development jobs",
    "cloud solutions careers",
    "DevOps engineer positions",
    "business automation jobs",
    "digital transformation careers",
    "technology consulting positions",
    "IT jobs"
  ],
  url: "https://cumi.dev/opportunities",
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Career Opportunities"
    },
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Job Openings"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Career Opportunities & Job Openings",
    description: "Join our software development team and explore exciting career opportunities in technology.",
    images: [defaultImages[1], defaultImages[2]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/opportunities"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Career Opportunities & Job Openings",
    description: "Join our software development team and explore exciting career opportunities in technology.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Career Opportunities",
    "description": "Software development jobs, internships, and career opportunities",
    "url": "https://cumi.dev/opportunities",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Job Opportunities",
      "description": "Collection of software development positions and career opportunities"
    }
  }
});

export default function OpportunitiesPage() {
  return <OpportunitiesPageComponent />;
}

