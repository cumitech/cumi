import { Metadata } from "next";
import OurServicesPageComponent from "@components/page-components/our-services-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/our-services", {
  title: "Our Services - CUMI Software Development Solutions",
  description: "Explore CUMI's comprehensive software development services including web applications, mobile apps, cloud solutions, API development, database design, and digital transformation services for businesses of all sizes.",
  keywords: [
    "software development services",
    "web application development",
    "mobile app development",
    "cloud solutions",
    "API development services",
    "database design",
    "user experience design",
    "responsive web design",
    "e-commerce development",
    "content management systems",
    "progressive web apps",
    "business automation",
    "digital transformation",
    "IT consulting services",
    "custom software solutions",
    "technology consulting",
    "full-stack development",
    "frontend development",
    "backend development",
    "DevOps services"
  ],
  url: "https://cumi.dev/our-services",
  alternates: {
    canonical: "https://cumi.dev/our-services"
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Software Development Services"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Solutions"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Software Development Services",
    description: "Comprehensive software development services including web apps, mobile apps, cloud solutions, and digital transformation for businesses worldwide.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/our-services"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Software Development Services",
    description: "Comprehensive software development services including web apps, mobile apps, cloud solutions, and digital transformation.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Software Development Services",
    "description": "Comprehensive software development services including web applications, mobile apps, cloud solutions, and digital transformation",
    "provider": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev"
    },
    "serviceType": "Software Development",
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Application Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cloud Solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Transformation"
          }
        }
      ]
    }
  }
  });
}

export default function OurServicesPage() {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Software Development Services",
    "description": "Comprehensive software development services including web applications, mobile apps, cloud solutions, and digital transformation",
    "provider": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev"
    },
    "serviceType": "Software Development",
    "areaServed": "Worldwide",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Application Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cloud Solutions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Transformation"
          }
        }
      ]
    }
  };

  return (
    <>
      <SchemaRenderer schemas={servicesSchema} includeDefaults={false} />
      <OurServicesPageComponent />
    </>
  );
}

