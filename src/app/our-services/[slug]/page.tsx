import { Metadata } from "next";
import ServiceDetailPageComponent from "@components/page-components/service-detail-page.component";

interface ServiceDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const slug = params.slug;
  
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
    description: `Discover our professional ${slug.replace(/-/g, ' ')} services. Expert solutions tailored to your business needs with cutting-edge technology and innovation.`,
    keywords: ["professional services", "web development", "digital solutions", "technology services", slug.replace(/-/g, ' ')],
    openGraph: {
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
      description: `Discover our professional ${slug.replace(/-/g, ' ')} services. Expert solutions tailored to your business needs with cutting-edge technology and innovation.`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Services | Cumi Digital Solutions`,
      description: `Discover our professional ${slug.replace(/-/g, ' ')} services. Expert solutions tailored to your business needs with cutting-edge technology and innovation.`,
    },
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  return <ServiceDetailPageComponent slug={params.slug} />;
}
