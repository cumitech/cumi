import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import ProjectsPageComponent from "@components/page-components/projects-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/projects", {
  title: "Our Projects - CUMI Digital Agency",
  description: "Projects that help businesses scale. Web apps, mobile apps, and custom software built for small businesses and enterprises.",
  keywords: [
    "software development portfolio",
    "web application projects",
    "mobile app development portfolio",
    "cloud solutions projects",
    "digital transformation projects",
    "custom software development",
    "technology project showcase",
    "programming portfolio",
    "software engineering projects",
    "full-stack development projects",
    "frontend development portfolio",
    "backend development projects",
    "API development portfolio",
    "database design projects",
    "user experience design portfolio",
    "responsive web design projects",
    "e-commerce development portfolio",
    "progressive web app projects",
    "business automation projects",
    "DevOps projects"
  ],
  url: `${SITE_URL}/projects`,
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Projects - Digital Agency Portfolio"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Digital Agency Projects"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI - Projects That Help Businesses Scale",
    description: "Web apps, mobile apps, and custom software built for small businesses and enterprises.",
    images: [defaultImages[1], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: `${SITE_URL}/projects`
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI - Projects That Help Businesses Scale",
    description: "Web apps, mobile apps, and custom software built for small businesses and enterprises.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Projects",
    "description": "Projects that help businesses scale. Web apps, mobile apps, and custom software for small businesses and enterprises",
    "url": `${SITE_URL}/projects`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "CUMI Projects",
      "description": "Web apps, mobile apps, and custom software for small businesses and enterprises"
    }
  }
  });
}

export default function ProjectsPage() {
  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Projects",
    "description": "Projects that help businesses scale. Web apps, mobile apps, and custom software for small businesses and enterprises",
    "url": `${SITE_URL}/projects`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "CUMI Projects",
      "description": "Web apps, mobile apps, and custom software for small businesses and enterprises"
    }
  };

  return (
    <>
      <SchemaRenderer schemas={projectsSchema} includeDefaults={false} />
      <ProjectsPageComponent />
    </>
  );
}

