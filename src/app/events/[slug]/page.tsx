import { Metadata } from "next";
import EventDetailPageComponent from "@components/page-components/event-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

interface EventDetailPageProps {
  params: { slug: string };
}

// Fetch event details for SEO
const fetchEventDetails = async (slug: string) => {
  try {
    const response = await fetchApiData(`/api/events/slugs/${slug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching event ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Event - CUMI Technology Events",
      description: "Join CUMI's technology events and workshops.",
      url: "https://cumi.dev/events"
    });
  }

  const event = await fetchEventDetails(params.slug);
  
  if (!event) {
    return generatePageMetadata({
      title: "Event - CUMI Technology Events",
      description: "Join CUMI's technology events and workshops.",
      url: "https://cumi.dev/events"
    });
  }

  return generatePageMetadata({
    title: `${event.title} - CUMI Technology Event`,
    description: event.description || `Join CUMI's ${event.title} event. Learn about software development, technology trends, and digital innovation.`,
    keywords: [
      "technology events",
      "software development workshops",
      "web development conferences",
      "programming meetups",
      "tech industry events",
      "digital transformation seminars",
      "mobile app development workshops",
      "cloud computing events",
      "API development workshops",
      "database design seminars",
      "user experience design events",
      "responsive web design workshops",
      "e-commerce development seminars",
      "DevOps conferences",
      "business automation workshops",
      "technology innovation events",
      "IT consulting seminars",
      "tech networking events",
      event.title,
      event.location,
      event.category
    ].filter(Boolean),
    url: `https://cumi.dev/events/${params.slug}`,
    alternates: {
      canonical: `https://cumi.dev/events/${params.slug}`,
    },
    images: event.imageUrl ? [{
      url: event.imageUrl,
      width: 1200,
      height: 630,
      alt: event.title,
    }] : [{
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Event",
    }],
    publishedTime: new Date(event.createdAt).toISOString(),
    modifiedTime: new Date(event.updatedAt).toISOString(),
    // OpenGraph
    openGraph: {
      type: "website",
      title: `${event.title} - CUMI Technology Event`,
      description: event.description || `Join CUMI's ${event.title} event. Learn about technology and innovation.`,
      images: event.imageUrl ? [event.imageUrl] : [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/events/${params.slug}`,
    },
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: `${event.title} - CUMI Technology Event`,
      description: event.description || `Join CUMI's ${event.title} event. Learn about technology and innovation.`,
      images: event.imageUrl ? [event.imageUrl] : [defaultImages[0]],
      creator: "@cumi_dev",
    },
    // Structured data
    schema: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.startDate ? new Date(event.startDate).toISOString() : undefined,
      "endDate": event.endDate ? new Date(event.endDate).toISOString() : undefined,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": event.isOnline ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
      "location": event.isOnline ? {
        "@type": "VirtualLocation",
        "url": event.location
      } : {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.location
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "CUMI",
        "url": "https://cumi.dev",
        "logo": "https://cumi.dev/img/cumi-green.jpg"
      },
      "offers": event.price ? {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      } : undefined,
      "image": event.imageUrl || defaultImages[0],
      "category": event.category
    },
  });
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventDetails(params.slug);
  
  const eventSchema = event ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDate ? new Date(event.startDate).toISOString() : undefined,
    "endDate": event.endDate ? new Date(event.endDate).toISOString() : undefined,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.isOnline ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "location": event.isOnline ? {
      "@type": "VirtualLocation",
      "url": event.location
    } : {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.location
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
      "logo": "https://cumi.dev/cumi-green.jpg"
    },
    "offers": event.price ? {
      "@type": "Offer",
      "price": event.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    } : undefined,
    "image": event.imageUrl || defaultImages[0],
    "category": event.category
  } : null;

  return (
    <>
      {eventSchema && (
        <SchemaRenderer schemas={eventSchema} includeDefaults={false} />
      )}
      <EventDetailPageComponent eventSlug={params.slug} />
    </>
  );
}