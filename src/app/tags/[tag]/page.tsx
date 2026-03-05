import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
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
      url: `${SITE_URL}/tags`
    });
  }

  const tag = await fetchTagDetails(params.tag);
  
  if (!tag) {
    return generatePageMetadata({
      title: "Tag - CUMI Technology Blog",
      description: "Explore technology blog posts by tag.",
      url: `${SITE_URL}/tags`
    });
  }

  const baseUrl = SITE_URL;
  const tagUrl = `${baseUrl}/tags/${params.tag}`;
  const postImages = tag.posts?.slice(0, 3).map((post: any) => ({
    url: post.imageUrl
      ? (post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}/uploads/posts/${post.imageUrl}`)
      : defaultImages[0],
    width: 800,
    height: 600,
    alt: post.title,
  })) || [{ url: defaultImages[0], width: 1200, height: 630, alt: tag.name }];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag.name} Articles | CUMI Technology Blog`,
    description: tag.description || `Discover articles tagged with ${tag.name}`,
    url: tagUrl,
    mainEntity: {
      "@type": "ItemList",
      name: `${tag.name} Articles`,
      numberOfItems: tag.posts?.length || 0,
      itemListElement: tag.posts?.slice(0, 10).map((post: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          name: post.title,
          url: `${baseUrl}/blog-posts/${post.slug}`,
        },
      })) || [],
    },
  };

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
      tag.name,
      `${tag.name} articles`,
      `${tag.name} blog posts`,
      `posts about ${tag.name}`,
    ].filter(Boolean),
    url: tagUrl,
    alternates: {
      canonical: tagUrl,
    },
    image: defaultImages[0],
    images: postImages,
    publishedTime: new Date(tag.createdAt).toISOString(),
    modifiedTime: new Date(tag.updatedAt).toISOString(),
    openGraph: {
      type: "website",
      title: `${tag.name} Content Collection | CUMI Technology Blog`,
      description: tag.description || `Discover ${tag.posts?.length || ""} articles tagged with ${tag.name}`,
      images: postImages.map((img: { url: string }) => img.url),
      siteName: "CUMI",
      locale: "en_US",
      url: tagUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tag.name} Articles | CUMI Technology Blog`,
      description: `Explore ${tag.posts?.length || ""} posts about ${tag.name}`,
      images: [postImages[0]?.url || defaultImages[0]],
      creator: "@cumi_dev",
    },
    schema: collectionSchema,
  });
}

export default function TagPage({ params }: TagPageProps) {
  return <TagDetailPageComponent tag={params.tag} />;
}
