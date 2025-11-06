import { Metadata } from "next";
import TagDetailPageComponent from "@components/page-components/tag-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";

interface TagPageProps {
  params: { tag: string };
}

// Fetch tag details for SEO
const fetchTagDetails = async (tag: string) => {
  try {
    const response = await fetchApiData(`/api/tags/slugs/${tag}`);
    return response;
  } catch (error) {
    console.error(`Error fetching tag ${tag}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  if (!params?.tag) {
    return generatePageMetadata({
      title: "Tag - CUMI Technology Blog",
      description: "Explore technology blog posts by tag.",
      url: "https://cumi.dev/tags"
    });
  }

  const tag = await fetchTagDetails(params.tag);
  
  if (!tag) {
    return generatePageMetadata({
      title: "Tag - CUMI Technology Blog",
      description: "Explore technology blog posts by tag.",
      url: "https://cumi.dev/tags"
    });
  }

  return generatePageMetadata({
    title: `${tag.name} Content | CUMI Technology Blog`,
    description: tag.description || `Discover ${tag.posts?.length || ""} articles tagged with ${tag.name}`,
    keywords: [
      "technology blog",
      "software development",
      "web development",
      "programming",
      "digital transformation",
      "tech articles",
      "programming tutorials",
      "software engineering",
      "API development",
      "database design",
      "user experience design",
      "responsive web design",
      "e-commerce development",
      "cloud solutions",
      "DevOps",
      "business automation",
      "tech industry insights",
      "development best practices",
      "coding tutorials",
      tag.name,
      ...(tag.posts?.slice(0, 3).map((post: any) => post.title.split(" ")) || []).flat(),
      `${tag.name} articles`,
      `${tag.name} blog posts`,
      `posts about ${tag.name}`
    ].filter(Boolean),
    url: `https://cumi.dev/tags/${params.tag}`,
    alternates: {
      canonical: `https://cumi.dev/tags/${params.tag}`,
    },
    images: tag.posts?.slice(0, 3).map((post: any) => ({
      url: post.imageUrl || defaultImages[0],
      width: 800,
      height: 600,
      alt: post.title,
    })) || [defaultImages[0]],
    publishedTime: new Date(tag.createdAt).toISOString(),
    modifiedTime: new Date(tag.updatedAt).toISOString(),
    // OpenGraph
    openGraph: {
      type: "website",
      title: `${tag.name} Content Collection`,
      description: `${tag.posts?.length || ""} articles tagged with ${tag.name}`,
      images: [defaultImages[0], defaultImages[1]],
      siteName: "CUMI",
      locale: "en_US",
      url: "https://cumi.dev",
    },
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: `#${tag.name} Articles`,
      description: `Explore ${tag.posts?.length || ""} posts about ${tag.name}`,
      images: [defaultImages[0]],
      creator: "@cumi_dev",
    },
    // Structured data
    schema: {
      collectionPage: {
        name: `${tag.name} Articles`,
        about: tag.name,
        description: `Collection of content tagged with ${tag.name}`,
        hasPart: tag.posts?.map((post: any) => ({
          "@type": "BlogPosting",
          name: post.title,
          url: `https://cumi.dev/blog-posts/${post.slug}`,
          keywords: tag.name,
        })) || [],
      },
      // Add hashtag schema for better topic recognition
      hashtag: {
        "@type": "Thing",
        name: tag.name,
        url: `https://cumi.dev/tags/${params.tag}`,
      },
    },
  });
}

export default function TagPage({ params }: TagPageProps) {
  return <TagDetailPageComponent tag={params.tag} />;
}
