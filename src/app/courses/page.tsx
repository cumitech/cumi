import { Metadata } from "next";
import CoursesPageComponent from "@components/page-components/courses-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/courses", {
  title: "Courses - CUMI Software Development Training & Education",
  description: "Enroll in CUMI's comprehensive software development courses. Learn web development, mobile app development, cloud solutions, API development, and digital transformation from industry experts.",
  keywords: [
    "software development courses",
    "web development training",
    "mobile app development courses",
    "programming education",
    "digital transformation training",
    "technology courses",
    "coding bootcamp",
    "software engineering courses",
    "full-stack development training",
    "frontend development courses",
    "backend development training",
    "API development courses",
    "database design training",
    "user experience design courses",
    "responsive web design training",
    "e-commerce development courses",
    "cloud solutions training",
    "DevOps courses",
    "business automation training",
    "technology certification"
  ],
  url: "https://cumi.dev/courses",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Software Development Courses"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Training"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Software Development Courses",
    description: "Enroll in our comprehensive software development courses and learn from industry experts.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/courses"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Software Development Courses",
    description: "Enroll in our comprehensive software development courses and learn from industry experts.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Software Development Courses",
    "description": "Comprehensive software development courses and technology training programs",
    "url": "https://cumi.dev/courses",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Software Development Courses",
      "description": "Collection of courses covering web development, mobile apps, and digital transformation"
    }
  }
  });
}

export default function CoursesPage() {
  return <CoursesPageComponent />;
}
