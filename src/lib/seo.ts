import { Metadata } from 'next';
import { getPageMetadata } from '@utils/meta-data-utils';

const url = process.env.NEXTAUTH_URL || "https://cumi.dev";

// Base keywords for the website
export const baseKeywords = [
  "software development",
  "web development",
  "mobile app development",
  "digital solutions",
  "technology consulting",
  "CUMI",
  "custom software",
  "business automation",
  "digital transformation",
  "IT services",
  "software engineering",
  "full-stack development",
  "cloud solutions",
  "database design",
  "API development",
  "user experience design",
  "responsive web design",
  "e-commerce solutions",
  "content management systems",
  "progressive web apps"
];

// Default images for SEO
export const defaultImages = [
  `${url}/uploads/media/1022.jpg`,
  `${url}/uploads/img/IMG_4491-min.jpeg`,
  `${url}/uploads/img/relaxing.jpg`
];

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  publishedTime?: string;
  modifiedTime?: string;
  alternates?: {
    canonical?: string;
  };
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    images?: string[];
    siteName?: string;
    locale?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
    creator?: string;
  };
  schema?: any;
  locale?: string;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    url: pageUrl = url,
    image = defaultImages[0],
    images = [],
    publishedTime,
    modifiedTime,
    alternates,
    openGraph,
    twitter,
    schema,
    locale = 'en'
  } = options;

  const allKeywords = [...baseKeywords, ...keywords].join(", ");

  return {
    metadataBase: new URL(pageUrl),
    title: {
      default: title,
      template: `%s | CUMI`,
    },
    description,
    keywords: allKeywords,
    manifest: `${url}/site.webmanifest`,
    appleWebApp: {
      title: "CUMI",
      statusBarStyle: "default",
      capable: true,
      startupImage: "/apple-touch-icon.png",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: images.length > 0 ? images.map(img => img.url) : [image],
      creator: "@cumi_dev",
      ...twitter
    },
    alternates: {
      canonical: alternates?.canonical || pageUrl,
      ...alternates
    },
    openGraph: {
      title: title,
      description: description,
      images: images.length > 0 ? images.map(img => img.url) : [image],
      siteName: "CUMI",
      locale: "en_US",
      url: pageUrl,
      type: "website",
      ...openGraph
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(schema && { 'application/ld+json': JSON.stringify(schema) })
    }
  };
}

// Utility function to fetch data from API
export async function fetchApiData(endpoint: string) {
  try {
    const response = await fetch(`${url}${endpoint}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return null;
  }
}

// Utility function to generate structured data for different content types
export function generateStructuredData(type: string, data: any) {
  const baseUrl = url;
  
  switch (type) {
    case 'blogPost':
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/posts/${data.imageUrl}` : defaultImages[0],
        "author": {
          "@type": "Person",
          "name": data.authorName || "CUMI Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "CUMI",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "datePublished": data.createdAt,
        "dateModified": data.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}/blog-posts/${data.slug}`
        }
      };
      
    case 'project':
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/projects/${data.imageUrl}` : defaultImages[0],
        "url": `${baseUrl}/projects/${data.id}`,
        "creator": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "dateCreated": data.createdAt,
        "dateModified": data.updatedAt
      };
      
    case 'event':
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/events/${data.imageUrl}` : defaultImages[0],
        "startDate": data.startDate,
        "endDate": data.endDate,
        "location": data.location,
        "organizer": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "USD"
        }
      };
      
    case 'course':
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": data.title,
        "description": data.description,
        "image": data.imageUrl ? `${baseUrl}/uploads/courses/${data.imageUrl}` : defaultImages[0],
        "provider": {
          "@type": "Organization",
          "name": "CUMI"
        },
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "USD"
        }
      };
      
    case 'organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CUMI",
        "alternateName": "CUMI Technologies",
        "description": "Leading software development and digital solutions company specializing in web development, mobile apps, and custom software solutions",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/cumi-green.jpg`,
          "width": 160,
          "height": 90
        },
        "image": `${baseUrl}/cumi-green.jpg`,
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Douala",
          "addressCountry": "Cameroon"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+237-681-289-411",
          "contactType": "customer service",
          "email": "info@cumi.dev",
          "availableLanguage": ["English", "French"]
        },
        "sameAs": [
          "https://web.facebook.com/ayeahgodlove/",
          "https://twitter.com/GodloveAyeah",
          "https://www.linkedin.com/in/ayeah-godlove-akoni-0820a0164/",
          "https://github.com/ayeahgodlove"
        ],
        "serviceArea": {
          "@type": "Country",
          "name": "Cameroon"
        },
        "knowsAbout": [
          "Software Development",
          "Web Development",
          "Mobile App Development",
          "Digital Solutions",
          "Technology Consulting",
          "Custom Software",
          "Business Automation",
          "Digital Transformation"
        ]
      };
      
    case 'website':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "CUMI - Software Development & Digital Solutions",
        "url": baseUrl,
        "description": "Transform your business with CUMI's cutting-edge software development, web applications, mobile apps, and digital solutions",
        "publisher": {
          "@type": "Organization",
          "name": "CUMI",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/cumi-green.jpg`
          }
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
      
    case 'service':
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": data.title,
        "description": data.description,
        "provider": {
          "@type": "Organization",
          "name": "CUMI",
          "url": baseUrl
        },
        "serviceType": data.category || "Software Development",
        "areaServed": {
          "@type": "Country",
          "name": "Cameroon"
        }
      };
      
    default:
      return null;
  }
}

/**
 * Generate dynamic metadata for a page using the meta-data system
 * This function will check if custom meta data exists for the page,
 * and fall back to generated metadata if not found
 */
export async function generateDynamicPageMetadata(
  pagePath: string,
  fallbackOptions: PageMetadataOptions
): Promise<Metadata> {
  try {
    // Try to get custom meta data first
    const dynamicMetadata = await getPageMetadata(
      pagePath,
      fallbackOptions.title,
      fallbackOptions.description
    );
    
    // If we got custom metadata, use it
    if (dynamicMetadata) {
      return dynamicMetadata;
    }
  } catch (error) {
    console.error('Error getting dynamic metadata:', error);
  }
  
  // Fall back to generating metadata with the provided options
  return generatePageMetadata(fallbackOptions);
}

