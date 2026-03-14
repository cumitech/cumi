import { Metadata } from "next";
import ServiceDetailPageComponent from "@components/page-components/service-detail-page.component";

interface ServiceDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const slug = params.slug;
  
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
    description: `Professional ${slug.replace(/-/g, ' ')} services from CUMI. Solutions for your business needs.`,
    keywords: ["professional services", "web development", "digital solutions", "technology services", slug.replace(/-/g, ' ')],
    openGraph: {
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
      description: `Professional ${slug.replace(/-/g, ' ')} services from CUMI. Solutions for your business needs.`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
      description: `Professional ${slug.replace(/-/g, ' ')} services from CUMI. Solutions for your business needs.`,
    },
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return <ServiceDetailPageComponent slug={params.slug} />;
}
