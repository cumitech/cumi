import { Metadata } from "next";
import { metaDataService } from "@services/meta-data.service";
import { IMetaData } from "@domain/models/meta-data.model";
import { APP_URL } from "@constants/api-url";

/**
 * Generate Next.js metadata from MetaData entity
 */
export function generateMetadataFromMetaData(metaData: IMetaData): Metadata {
  const baseUrl = APP_URL;

  return {
    title: metaData.title,
    description: metaData.description,
    keywords: metaData.keywords.join(', '),
    authors: metaData.author ? [{ name: metaData.author }] : undefined,
    robots: metaData.robots,
    alternates: {
      canonical: metaData.canonical,
    },
    openGraph: {
      title: metaData.ogTitle || metaData.title,
      description: metaData.ogDescription || metaData.description,
      url: metaData.ogUrl || metaData.canonical,
      siteName: 'CUMI',
      images: metaData.ogImage ? [
        {
          url: metaData.ogImage,
          width: 1200,
          height: 630,
          alt: metaData.ogTitle || metaData.title,
        }
      ] : undefined,
      locale: 'en_US',
      type: (metaData.ogType === 'blog' ? 'article' : metaData.ogType === 'product' ? 'website' : metaData.ogType) || 'website',
    },
    twitter: {
      card: metaData.twitterCard || 'summary_large_image',
      title: metaData.twitterTitle || metaData.ogTitle || metaData.title,
      description: metaData.twitterDescription || metaData.ogDescription || metaData.description,
      images: metaData.twitterImage ? [metaData.twitterImage] : undefined,
    },
    other: {
      ...(metaData.publishedTime && { 'article:published_time': metaData.publishedTime.toISOString() }),
      ...(metaData.modifiedTime && { 'article:modified_time': metaData.modifiedTime.toISOString() }),
      ...(metaData.customSchema && { 'application/ld+json': JSON.stringify(metaData.customSchema) }),
    },
  };
}

/**
 * Get page metadata by path
 */
export async function getPageMetadata(pagePath: string, fallbackTitle?: string, fallbackDescription?: string): Promise<Metadata> {
  try {
    const metaData = await metaDataService.getOrCreateMetaData(pagePath, fallbackTitle, fallbackDescription);
    // Convert model to plain object if needed
    const plainMetaData = (metaData as any).toJSON?.() || metaData;
    return generateMetadataFromMetaData(plainMetaData);
  } catch (error) {
    console.error('Error getting page metadata:', error);
    
    // Fallback to basic metadata
    const baseUrl = APP_URL;
    const title = fallbackTitle || `${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} - CUMI`;
    const description = fallbackDescription || `Learn more about ${pagePath.charAt(1).toUpperCase() + pagePath.slice(2)} on CUMI.`;

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}${pagePath}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}${pagePath}`,
        siteName: 'CUMI',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  }
}

/**
 * Get meta data for a specific page (for server-side usage)
 */
export async function getPageMetaData(pagePath: string): Promise<IMetaData | null> {
  try {
    const metaData = await metaDataService.getPageMetaData(pagePath);
    if (!metaData) return null;
    return (metaData as any).toJSON?.() || metaData;
  } catch (error) {
    console.error('Error getting page meta data:', error);
    return null;
  }
}

/**
 * Save meta data for a page (for server-side usage)
 */
export async function savePageMetaData(metaData: IMetaData): Promise<IMetaData | null> {
  try {
    const saved = await metaDataService.saveMetaData(metaData);
    if (!saved) return null;
    return (saved as any).toJSON?.() || saved;
  } catch (error) {
    console.error('Error saving page meta data:', error);
    return null;
  }
}

/**
 * Delete meta data for a page (for server-side usage)
 */
export async function deletePageMetaData(id: string): Promise<boolean> {
  try {
    return await metaDataService.deleteMetaData(id);
  } catch (error) {
    console.error('Error deleting page meta data:', error);
    return false;
  }
}

/**
 * Generate schema.org JSON-LD from MetaData
 */
export function generateSchemaFromMetaData(metaData: IMetaData): any {
  const baseUrl = APP_URL;

  if (metaData.customSchema) {
    return metaData.customSchema;
  }

  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": metaData.schemaType,
    "name": metaData.title,
    "description": metaData.description,
    "url": metaData.canonical,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": metaData.canonical
    },
    "publisher": {
      "@type": "Organization",
      "name": "CUMI",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
  };

  // Add author if available
  if (metaData.author) {
    baseSchema.author = {
      "@type": "Person",
      "name": metaData.author
    };
  }

  // Add dates if available
  if (metaData.publishedTime) {
    baseSchema.datePublished = metaData.publishedTime.toISOString();
  }
  if (metaData.modifiedTime) {
    baseSchema.dateModified = metaData.modifiedTime.toISOString();
  }

  // Add specific schema types
  switch (metaData.schemaType) {
    case 'Article':
    case 'BlogPosting':
      baseSchema.headline = metaData.title;
      baseSchema.image = metaData.ogImage;
      break;
    case 'Product':
      baseSchema.image = metaData.ogImage;
      break;
    case 'Event':
      baseSchema.eventStatus = "EventScheduled";
      break;
    case 'Organization':
      baseSchema.logo = metaData.ogImage;
      break;
  }

  return baseSchema;
}

/**
 * Get all available pages with meta data (for sitemap generation)
 */
export async function getAllPagesWithMetaData(): Promise<{ path: string; metaData: IMetaData | null }[]> {
  try {
    const allMetaData = await metaDataService.getAllMetaData();
    const pages: { path: string; metaData: IMetaData | null }[] = [];

    // Add all pages that have meta data
    allMetaData.forEach(metaData => {
      const plainMetaData = (metaData as any).toJSON?.() || metaData;
      pages.push({
        path: plainMetaData.page,
        metaData: plainMetaData
      });
    });

    return pages;
  } catch (error) {
    console.error('Error getting all pages with meta data:', error);
    return [];
  }
}
