import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import FAQsPageComponent from "@components/page-components/faqs-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/faqs", {
  title: "FAQ - CUMI Digital Agency",
  description: "Frequently asked questions about CUMI. We build web apps, mobile apps, and custom software for small businesses and enterprises.",
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
    title: "FAQ - CUMI Digital Agency",
    description: "Frequently asked questions about CUMI. Digital solutions for small businesses and enterprises.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - CUMI Digital Agency",
    description: "Frequently asked questions about CUMI. Digital solutions for small businesses and enterprises.",
  },
  url: `${SITE_URL}/faqs`,
  alternates: {
    canonical: `${SITE_URL}/faqs`
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI FAQ - Digital Agency"
    }
  ],
  schema: generateStructuredData('FAQPage', {
    name: "CUMI Digital Agency FAQ",
    description: "Frequently asked questions about CUMI. Digital solutions for small businesses and enterprises",
    url: `${SITE_URL}/faqs`
  })
  });
}

const faqPageSchema = generateStructuredData("FAQPage", {
  name: "CUMI Digital Agency FAQ",
  description:
    "Frequently asked questions about CUMI. Digital solutions for small businesses and enterprises",
  url: `${SITE_URL}/faqs`,
});

export default function FAQsPage() {
  return (
    <>
      {faqPageSchema && (
        <SchemaRenderer schemas={faqPageSchema} includeDefaults={false} />
      )}
      <FAQsPageComponent />
    </>
  );
}

