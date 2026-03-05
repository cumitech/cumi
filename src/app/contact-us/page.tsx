import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import ContactUsPageComponent from "@components/page-components/contact-us-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/contact-us", {
  title: "Contact Us - CUMI Digital Agency",
  description: "Get in touch with CUMI. We build web apps, mobile apps, and custom software for small businesses and enterprises. Let's discuss your project.",
  keywords: [
    "contact CUMI",
    "software development consultation",
    "web development contact",
    "mobile app development inquiry",
    "digital transformation consultation",
    "custom software development contact",
    "technology consulting services",
    "IT consulting contact",
    "cloud solutions consultation",
    "API development services",
    "database design consultation",
    "user experience design contact",
    "responsive web design inquiry",
    "e-commerce development consultation",
    "business automation services",
    "get software development quote",
    "technology project consultation",
    "software engineering services",
    "full-stack development contact",
    "DevOps services consultation"
  ],
  url: `${SITE_URL}/contact-us`,
  alternates: {
    canonical: `${SITE_URL}/contact-us`
  },
  image: defaultImages[2],
  images: [
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "Contact CUMI - Software Development Experts"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Contact Information"
    }
  ],
  openGraph: {
    type: "website",
    title: "Contact CUMI - Digital Agency",
    description: "Get in touch with CUMI. We build solutions for small businesses and enterprises. Let's discuss your project.",
    images: [defaultImages[2], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: `${SITE_URL}/contact-us`
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact CUMI - Digital Agency",
    description: "Get in touch with CUMI. We build solutions for small businesses and enterprises.",
    images: [defaultImages[2]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CUMI",
    "description": "Contact CUMI for digital solutions. We build web apps, mobile apps, and custom software for small businesses and enterprises",
    "mainEntity": {
      "@type": "Organization",
      "name": "CUMI",
      "url": SITE_URL,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@cumi.dev",
        "telephone": "+1-XXX-XXX-XXXX",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressLocality": "City",
        "addressRegion": "State"
      },
      "sameAs": [
        "https://twitter.com/cumi_dev",
        "https://linkedin.com/company/cumi"
      ]
    }
  }
  });
}

export default function ContactUsPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CUMI",
    "description": "Contact CUMI for digital solutions. We build web apps, mobile apps, and custom software for small businesses and enterprises",
    "mainEntity": {
      "@type": "Organization",
      "name": "CUMI",
      "url": SITE_URL,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@cumi.dev",
        "telephone": "+237-681-289-411",
        "availableLanguage": ["English", "French"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CM",
        "addressLocality": "Douala",
        "addressRegion": "Littoral"
      },
      "sameAs": [
        "https://web.facebook.com/ayeahgodlove/",
        "https://twitter.com/GodloveAyeah",
        "https://www.linkedin.com/in/ayeah-godlove-akoni-0820a0164/"
      ]
    }
  };

  return (
    <>
      <SchemaRenderer schemas={contactSchema} includeDefaults={false} />
      <ContactUsPageComponent />
    </>
  );
}

