import { Metadata } from "next";
import AboutPageComponent from "@components/page-components/about-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/about-us", {
  title: "About Us - CUMI Software Development Company",
  description: "Discover CUMI's story, mission, and expert team. Learn about our commitment to delivering innovative software development solutions, digital transformation services, and cutting-edge technology for businesses worldwide.",
  keywords: [
    "about CUMI",
    "software development company",
    "technology team",
    "company mission",
    "digital transformation experts",
    "software engineering team",
    "IT consulting company",
    "web development company",
    "mobile app development team",
    "custom software solutions",
    "technology innovation",
    "business automation experts",
    "cloud solutions provider",
    "API development specialists",
    "database design experts",
    "user experience designers",
    "responsive web design team",
    "e-commerce development",
    "content management systems",
    "progressive web apps"
  ],
  url: "https://cumi.dev/about-us",
  alternates: {
    canonical: "https://cumi.dev/about-us"
  },
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Team - Software Development Experts"
    },
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Office - Technology Innovation Hub"
    }
  ],
  openGraph: {
    type: "website",
    title: "About CUMI - Leading Software Development Company",
    description: "Meet the expert team behind CUMI's innovative software development solutions. Learn about our mission to transform businesses through cutting-edge technology.",
    images: [defaultImages[1], defaultImages[2]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/about-us"
  },
  twitter: {
    card: "summary_large_image",
    title: "About CUMI - Software Development Experts",
    description: "Meet the expert team behind CUMI's innovative software development solutions and digital transformation services.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData('organization', {
    name: "CUMI",
    description: "Leading software development company specializing in web applications, mobile apps, and digital solutions",
    url: "https://cumi.dev",
    foundingDate: "2020",
    numberOfEmployees: "50+",
    industry: "Software Development"
  })
  });
}

export default function AboutPage() {
  return <AboutPageComponent />;
}

