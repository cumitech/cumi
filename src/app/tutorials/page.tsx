import { Metadata } from "next";
import TutorialsPageComponent from "@components/page-components/tutorials-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/tutorials", {
  title: "Tutorials - CUMI Step-by-Step Learning Guides",
  description: "Access CUMI's comprehensive tutorials covering software development, web development, mobile app development, and programming best practices. Learn step-by-step with our expert guides.",
  keywords: [
    "programming tutorials",
    "web development tutorials",
    "software development guides",
    "coding tutorials",
    "mobile app development tutorials",
    "step-by-step guides",
    "programming lessons",
    "development tutorials",
    "coding walkthrough",
    "learn programming",
    "tech tutorials",
    "full-stack tutorials",
    "API development tutorials",
    "database tutorials",
    "frontend tutorials",
    "backend tutorials",
    "DevOps tutorials",
    "cloud computing tutorials",
    "software engineering tutorials",
    "technology education"
  ],
  url: "https://cumi.dev/tutorials",
  alternates: {
    canonical: "https://cumi.dev/tutorials"
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Tutorials - Learning Guides"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "Programming Tutorials - Step-by-Step Guides"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Tutorials - Comprehensive Learning Guides",
    description: "Learn software development through step-by-step tutorials and expert guides from CUMI's experienced team.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/tutorials"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Tutorials - Comprehensive Learning Guides",
    description: "Step-by-step tutorials on software development, web apps, and programming.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData('webpage', {
    name: "CUMI Tutorials",
    description: "Comprehensive tutorials and learning guides for software development",
    url: "https://cumi.dev/tutorials",
    mainEntity: {
      "@type": "CollectionPage",
      "name": "Tutorials",
      "description": "Programming and software development tutorials"
    }
  })
  });
}

export default function TutorialsPage() {
  return <TutorialsPageComponent />;
}

