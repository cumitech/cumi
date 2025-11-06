import { Metadata } from "next";
import ProjectsPageComponent from "@components/page-components/projects-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/projects", {
  title: "Our Projects - CUMI Software Development Portfolio",
  description: "Explore CUMI's portfolio of innovative software development projects including web applications, mobile apps, cloud solutions, and digital transformation projects built with cutting-edge technologies.",
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
  url: "https://cumi.dev/projects",
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Software Development Portfolio"
    },
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Projects"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Software Development Portfolio",
    description: "Explore our innovative software development projects including web applications, mobile apps, and digital transformation solutions.",
    images: [defaultImages[1], defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/projects"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Software Development Portfolio",
    description: "Explore our innovative software development projects including web applications, mobile apps, and digital solutions.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Software Development Portfolio",
    "description": "Portfolio of innovative software development projects and digital solutions",
    "url": "https://cumi.dev/projects",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Software Development Projects",
      "description": "Collection of web applications, mobile apps, and digital transformation projects"
    }
  }
  });
}

export default function ProjectsPage() {
  return <ProjectsPageComponent />;
}

