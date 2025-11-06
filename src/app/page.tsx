import { Metadata } from "next";
import HomePageComponent from "@components/page-components/home-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/", {
  title: "CUMI - Leading Software Development & Digital Solutions Company",
  description: "Transform your business with CUMI's cutting-edge software development, web applications, mobile apps, and digital solutions. Expert team delivering innovative technology solutions for startups to enterprises.",
  keywords: [
    "software development company",
    "web development services",
    "mobile app development",
    "digital transformation",
    "custom software solutions",
    "technology consulting",
    "full-stack development",
    "cloud solutions",
    "API development",
    "database design",
    "user experience design",
    "responsive web design",
    "e-commerce development",
    "content management systems",
    "progressive web apps",
    "business automation",
    "IT consulting services",
    "web applications",
    "mobile applications",
    "technology innovation"
  ],
  url: "https://cumi.dev",
  image: defaultImages[0],
  images: defaultImages.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: "CUMI - Software Development & Digital Solutions",
  })),
  openGraph: {
    type: "website",
    title: "CUMI - Leading Software Development & Digital Solutions",
    description: "Transform your business with CUMI's cutting-edge software development, web applications, mobile apps, and digital solutions.",
    images: defaultImages,
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI - Software Development & Digital Solutions",
    description: "Transform your business with CUMI's cutting-edge software development and digital solutions.",
    images: defaultImages,
    creator: "@cumi_dev",
  },
  schema: generateStructuredData("organization", {
    name: "CUMI",
    description: "Leading software development company specializing in web applications, mobile apps, and digital transformation solutions",
    url: "https://cumi.dev",
    foundingDate: "2020",
    numberOfEmployees: "50+",
    industry: "Software Development",
    services: [
      "Web Development",
      "Mobile App Development", 
      "Digital Transformation",
      "Cloud Solutions",
      "API Development",
      "Database Design",
      "User Experience Design"
    ]
  })
  });
}

export default function IndexPage() {
  return <HomePageComponent />;
}

