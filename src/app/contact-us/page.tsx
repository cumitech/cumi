import { Metadata } from "next";
import ContactUsPageComponent from "@components/page-components/contact-us-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/contact-us", {
  title: "Contact Us - CUMI Software Development Company",
  description: "Get in touch with CUMI's expert software development team. Contact us for web applications, mobile apps, cloud solutions, digital transformation, and custom software development services.",
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
  url: "https://cumi.dev/contact-us",
  alternates: {
    canonical: "https://cumi.dev/contact-us"
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
    title: "Contact CUMI - Software Development Experts",
    description: "Get in touch with CUMI's expert team for software development, web applications, mobile apps, and digital transformation services.",
    images: [defaultImages[2], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/contact-us"
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact CUMI - Software Development Team",
    description: "Get in touch with CUMI's expert team for software development and digital transformation services.",
    images: [defaultImages[2]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CUMI",
    "description": "Contact CUMI for software development services and digital transformation solutions",
    "mainEntity": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
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
    "description": "Contact CUMI for software development services and digital transformation solutions",
    "mainEntity": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
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

