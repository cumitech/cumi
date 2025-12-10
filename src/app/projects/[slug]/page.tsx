import { Metadata } from "next";
import ProjectDetailPageComponent from "@components/page-components/project-detail-page.component";
import { generatePageMetadata, generateStructuredData, defaultImages } from "../../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

interface ProjectDetailPageProps {
  params: { slug: string };
}

// Fetch project details for SEO
const fetchProjectDetails = async (slug: string) => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/slugs/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch project details");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Project - CUMI Software Development Portfolio",
      description: "Explore our innovative software development projects and digital solutions.",
      url: "https://cumi.dev/projects"
    });
  }

  const project = await fetchProjectDetails(params.slug);
  
  if (!project) {
    return generatePageMetadata({
      title: "Project - CUMI Software Development Portfolio",
      description: "Explore our innovative software development projects and digital solutions.",
      url: `https://cumi.dev/projects/${params.slug}`
    });
  }

  const projectImage = project.imageUrl 
    ? `${process.env.NEXTAUTH_URL}/uploads/projects/${project.imageUrl}`
    : defaultImages[1];

  const keywords = [
    "software development project",
    "web application project",
    "mobile app development",
    "digital solution",
    "technology project",
    "custom software development",
    "programming project",
    "software engineering",
    "full-stack development",
    "frontend development",
    "backend development",
    "API development",
    "database design",
    "user experience design",
    "responsive web design",
    "e-commerce development",
    "progressive web app",
    "business automation",
    project.title,
    ...(project.technologies || [])
  ];

  return generatePageMetadata({
    title: `${project.title} - CUMI Software Development Project`,
    description: project.description || `Explore ${project.title}, an innovative software development project from CUMI's portfolio. Discover cutting-edge web development solutions, mobile applications, and technology implementations.`,
    keywords,
    url: `https://cumi.dev/projects/${params.slug}`,
    image: projectImage,
    images: [
      {
        url: projectImage,
        width: 1200,
        height: 630,
        alt: project.title
      }
    ],
    publishedTime: new Date(project.createdAt).toISOString(),
    modifiedTime: new Date(project.updatedAt).toISOString(),
    alternates: {
      canonical: `https://cumi.dev/projects/${params.slug}`
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description || `Explore ${project.title}, an innovative software development project`,
      images: [projectImage],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/projects/${params.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description || `Explore ${project.title}, an innovative software development project`,
      images: [projectImage],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('project', {
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      id: params.slug
    })
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await fetchProjectDetails(params.slug);
  
  const projectSchema = project ? generateStructuredData('project', {
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    id: params.slug
  }) : null;

  return (
    <>
      {projectSchema && (
        <SchemaRenderer schemas={projectSchema} includeDefaults={false} />
      )}
      <ProjectDetailPageComponent slug={params.slug} />
    </>
  );
}
