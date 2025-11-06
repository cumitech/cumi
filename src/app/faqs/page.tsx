import { Metadata } from "next";
import FAQsPageComponent from "@components/page-components/faqs-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/faqs", {
  title: "FAQ - CUMI Software Development Questions",
  description: "Get answers to frequently asked questions about CUMI's software development services, web applications, mobile apps, cloud solutions, and digital transformation processes.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "software development questions",
    "web development FAQ",
    "mobile app development questions",
    "digital transformation FAQ",
    "cloud solutions questions",
    "API development FAQ",
    "database design questions",
    "user experience design FAQ",
    "responsive web design questions",
    "e-commerce development FAQ",
    "business automation questions",
    "technology consulting FAQ",
    "custom software solutions questions"
  ],
  openGraph: {
    title: "FAQ - CUMI Software Development Questions",
    description: "Get answers to frequently asked questions about CUMI's software development services and digital transformation solutions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - CUMI Software Development Questions",
    description: "Get answers to frequently asked questions about CUMI's software development services and digital transformation solutions.",
  },
  url: "https://cumi.dev/faqs",
  alternates: {
    canonical: "https://cumi.dev/faqs"
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI FAQ - Software Development Questions"
    }
  ],
  schema: generateStructuredData('FAQPage', {
    name: "CUMI Software Development FAQ",
    description: "Frequently asked questions about CUMI's software development services and digital transformation solutions",
    url: "https://cumi.dev/faqs"
  })
  });
}

export default function FAQsPage() {
  return <FAQsPageComponent />;
}

