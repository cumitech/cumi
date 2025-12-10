import { Metadata } from "next";
import BlogPostsPageComponent from "@components/page-components/blog-posts-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/blog-posts", {
  title: "Blog Posts - CUMI Technology Insights & Software Development Articles",
  description: "Explore CUMI's technology blog featuring software development insights, web development tutorials, mobile app development guides, digital transformation strategies, and industry best practices.",
  keywords: [
    "software development blog",
    "web development articles",
    "technology insights",
    "mobile app development blog",
    "digital transformation articles",
    "programming tutorials",
    "software engineering blog",
    "tech industry insights",
    "development best practices",
    "coding tutorials",
    "API development guides",
    "database design articles",
    "user experience design blog",
    "responsive web design tutorials",
    "e-commerce development insights",
    "cloud solutions blog",
    "DevOps articles",
    "business automation guides",
    "technology trends",
    "software architecture blog"
  ],
  url: "https://cumi.dev/blog-posts",
  alternates: {
    canonical: "https://cumi.dev/blog-posts"
  },
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Blog - Software Development Insights"
    },
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Blog Posts - Technology Articles"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Technology Blog - Software Development Insights",
    description: "Read expert insights on software development, web applications, mobile apps, and digital transformation from CUMI's technology blog.",
    images: [defaultImages[0], defaultImages[1]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/blog-posts"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Technology Blog - Software Development Articles",
    description: "Expert insights on software development, web applications, mobile apps, and digital transformation.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CUMI Technology Blog",
    "description": "Software development insights, web development tutorials, and technology articles",
    "url": "https://cumi.dev/blog-posts",
    "publisher": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cumi.dev/logo.png"
      }
    },
    "inLanguage": "en-US",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://cumi.dev/blog-posts"
    }
  }
  });
}

export default function BlogPostsPage() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CUMI Technology Blog",
    "description": "Software development insights, web development tutorials, and technology articles",
    "url": "https://cumi.dev/blog-posts",
    "publisher": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cumi.dev/cumi-green.jpg"
      }
    },
    "inLanguage": "en-US",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://cumi.dev/blog-posts"
    }
  };

  return (
    <>
      <SchemaRenderer schemas={blogSchema} includeDefaults={false} />
      <BlogPostsPageComponent />
    </>
  );
}

