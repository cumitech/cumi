import { Metadata } from "next";
import HomePageComponent from "@components/page-components/home-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";
import { SITE_URL } from "@constants/api-url";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/", {
  title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
  description: "CUMI is a digital agency that helps businesses scale. We build web apps, mobile apps, and custom software for small businesses and enterprises.",
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
  url: SITE_URL,
  image: defaultImages[0],
  images: defaultImages.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: "CUMI - Digital Agency for Business Growth",
  })),
  openGraph: {
    type: "website",
    title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
    description: "Digital agency helping businesses scale. Web apps, mobile apps, and custom software for small businesses and enterprises.",
    images: defaultImages,
    siteName: "CUMI",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
    description: "Digital agency helping businesses scale. Custom software for small businesses and enterprises.",
    images: defaultImages,
    creator: "@cumi_dev",
  },
  schema: generateStructuredData("organization", {
    name: "CUMI",
    description: "Digital agency helping businesses scale through web applications, mobile apps, and custom software for small businesses and enterprises",
    url: SITE_URL,
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
  const homePageSchema = generateStructuredData("organization", {
    name: "CUMI",
    description: "Digital agency helping businesses scale through web applications, mobile apps, and custom software for small businesses and enterprises",
    url: SITE_URL,
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
  });

  return (
    <>
      <SchemaRenderer 
        schemas={homePageSchema} 
        includeDefaults={false}
      />
      <HomePageComponent />
    </>
  );
}

