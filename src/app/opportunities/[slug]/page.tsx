import { Metadata } from "next";
import OpportunityDetailPageComponent from "@components/page-components/opportunity-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

interface OpportunityDetailPageProps {
  params: { slug: string };
}

// Fetch opportunity details for SEO
const fetchOpportunityDetails = async (slug: string) => {
  try {
    const response = await fetchApiData(`/api/opportunities/slugs/${slug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching opportunity ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: OpportunityDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Opportunity - CUMI Career Opportunities",
      description: "Explore career opportunities at CUMI.",
      url: "https://cumi.dev/opportunities"
    });
  }

  const opportunity = await fetchOpportunityDetails(params.slug);
  
  if (!opportunity) {
    return generatePageMetadata({
      title: "Opportunity - CUMI Career Opportunities",
      description: "Explore career opportunities at CUMI.",
      url: "https://cumi.dev/opportunities"
    });
  }

  return generatePageMetadata({
    title: `${opportunity.title} - CUMI Career Opportunity`,
    description: opportunity.description || `Join CUMI as a ${opportunity.title}. Explore this exciting career opportunity in software development and technology.`,
    keywords: [
      "software development jobs",
      "web development careers",
      "mobile app development positions",
      "programming jobs",
      "technology careers",
      "software engineering jobs",
      "full-stack developer positions",
      "frontend developer jobs",
      "backend developer careers",
      "API development positions",
      "database designer jobs",
      "user experience designer careers",
      "responsive web design positions",
      "e-commerce development jobs",
      "cloud solutions careers",
      "DevOps engineer positions",
      "business automation jobs",
      "digital transformation careers",
      "technology consulting positions",
      "IT jobs",
      opportunity.title,
      opportunity.type,
      opportunity.location
    ].filter(Boolean),
    url: `https://cumi.dev/opportunities/${params.slug}`,
    alternates: {
      canonical: `https://cumi.dev/opportunities/${params.slug}`,
    },
    images: opportunity.imageUrl ? [{
      url: opportunity.imageUrl,
      width: 1200,
      height: 630,
      alt: opportunity.title,
    }] : [{
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Career Opportunity",
    }],
    publishedTime: new Date(opportunity.createdAt).toISOString(),
    modifiedTime: new Date(opportunity.updatedAt).toISOString(),
    // OpenGraph
    openGraph: {
      type: "website",
      title: `${opportunity.title} - CUMI Career Opportunity`,
      description: opportunity.description || `Join CUMI as a ${opportunity.title}. Explore this exciting career opportunity.`,
      images: opportunity.imageUrl ? [opportunity.imageUrl] : [defaultImages[1]],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/opportunities/${params.slug}`,
    },
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: `${opportunity.title} - CUMI Career Opportunity`,
      description: opportunity.description || `Join CUMI as a ${opportunity.title}. Explore this exciting career opportunity.`,
      images: opportunity.imageUrl ? [opportunity.imageUrl] : [defaultImages[1]],
      creator: "@cumi_dev",
    },
    // Structured data
    schema: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": opportunity.title,
      "description": opportunity.description,
      "datePosted": new Date(opportunity.createdAt).toISOString(),
      "validThrough": opportunity.deadline ? new Date(opportunity.deadline).toISOString() : undefined,
      "employmentType": opportunity.type || "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "CUMI",
        "url": "https://cumi.dev",
        "logo": "https://cumi.dev/cumi-green.jpg"
      },
      "jobLocation": opportunity.location ? {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": opportunity.location
        }
      } : undefined,
      "baseSalary": opportunity.salary ? {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": opportunity.salary,
          "unitText": "YEAR"
        }
      } : undefined,
      "qualifications": opportunity.requirements,
      "responsibilities": opportunity.responsibilities,
      "skills": opportunity.skills
    },
  });
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const opportunity = await fetchOpportunityDetails(params.slug);
  
  const opportunitySchema = opportunity ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": opportunity.title,
    "description": opportunity.description,
    "datePosted": new Date(opportunity.createdAt).toISOString(),
    "validThrough": opportunity.deadline ? new Date(opportunity.deadline).toISOString() : undefined,
    "employmentType": opportunity.type || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
      "logo": "https://cumi.dev/cumi-green.jpg"
    },
    "jobLocation": opportunity.location ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": opportunity.location
      }
    } : undefined,
    "baseSalary": opportunity.salary ? {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": opportunity.salary,
        "unitText": "YEAR"
      }
    } : undefined,
    "qualifications": opportunity.requirements,
    "responsibilities": opportunity.responsibilities,
    "skills": opportunity.skills
  } : null;

  return (
    <>
      {opportunitySchema && (
        <SchemaRenderer schemas={opportunitySchema} includeDefaults={false} />
      )}
      <OpportunityDetailPageComponent opportunitySlug={params.slug} />
    </>
  );
}
