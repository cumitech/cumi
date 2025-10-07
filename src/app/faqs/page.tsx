import { Metadata } from "next";
import FAQsPageComponent from "@components/page-components/faqs-page.component";

export const metadata: Metadata = {
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
};

export default function FAQsPage() {
  return <FAQsPageComponent />;
}

