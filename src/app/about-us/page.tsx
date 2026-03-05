import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import AboutPageComponent from "@components/page-components/about-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/about-us", {
  title: "About Us - CUMI Digital Agency",
  description: "CUMI is a digital agency helping businesses scale. Learn about our story, mission, and how we build web apps, mobile apps, and custom software for small businesses and enterprises.",
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
  url: `${SITE_URL}/about-us`,
  alternates: {
    canonical: `${SITE_URL}/about-us`
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
    title: "About CUMI - Digital Agency for Business Growth",
    description: "CUMI helps businesses scale through web apps, mobile apps, and custom software. Learn about our mission and team.",
    images: [defaultImages[1], defaultImages[2]],
    siteName: "CUMI",
    locale: "en_US",
    url: `${SITE_URL}/about-us`
  },
  twitter: {
    card: "summary_large_image",
    title: "About CUMI - Digital Agency",
    description: "Digital agency helping businesses scale. Web apps, mobile apps, and custom software for small businesses and enterprises.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData('organization', {
    name: "CUMI",
    description: "Digital agency helping businesses scale through web applications, mobile apps, and custom software for small businesses and enterprises",
    url: SITE_URL,
    foundingDate: "2020",
    numberOfEmployees: "50+",
    industry: "Software Development"
  })
  });
}

export default function AboutPage() {
  const aboutSchema = generateStructuredData('organization', {
    name: "CUMI",
    description: "Digital agency helping businesses scale through web applications, mobile apps, and custom software for small businesses and enterprises",
    url: SITE_URL,
    foundingDate: "2020",
    numberOfEmployees: "50+",
    industry: "Software Development"
  });

  return (
    <>
      <SchemaRenderer schemas={aboutSchema} includeDefaults={false} />
      <AboutPageComponent />
    </>
  );
}

