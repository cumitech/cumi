import { Metadata } from "next";
import EventsPageComponent from "@components/page-components/events-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/events", {
  title: "Events - CUMI Technology Workshops & Conferences",
  description: "Join CUMI's technology events, workshops, and conferences. Learn about software development, web applications, mobile app development, and digital transformation from industry experts.",
  keywords: [
    "technology events",
    "software development workshops",
    "web development conferences",
    "mobile app development events",
    "digital transformation workshops",
    "programming conferences",
    "tech meetups",
    "software engineering events",
    "API development workshops",
    "database design conferences",
    "user experience design events",
    "responsive web design workshops",
    "e-commerce development conferences",
    "cloud solutions events",
    "DevOps workshops",
    "business automation conferences",
    "technology training",
    "coding bootcamps",
    "tech networking events",
    "industry conferences"
  ],
  url: "https://cumi.dev/events",
  image: defaultImages[2],
  images: [
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Events & Workshops"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Tech Conferences"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Technology Events & Workshops",
    description: "Join our technology events, workshops, and conferences to learn about software development and digital transformation.",
    images: [defaultImages[2], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/events"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Technology Events & Workshops",
    description: "Join our technology events, workshops, and conferences to learn about software development and digital transformation.",
    images: [defaultImages[2]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Technology Events",
    "description": "Technology workshops, conferences, and events for software development professionals",
    "url": "https://cumi.dev/events",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Technology Events",
      "description": "Collection of workshops, conferences, and networking events"
    }
  }
  });
}

export default function EventsPage() {
  return <EventsPageComponent />;
}
