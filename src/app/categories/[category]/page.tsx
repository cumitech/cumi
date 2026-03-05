import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import CategoryDetailPageComponent from "@components/page-components/category-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";

interface CategoryPageProps {
  params: { category: string };
}

// Fetch category details for SEO
const fetchCategoryDetails = async (category: string) => {
  try {
    const response = await fetchApiData(`/api/categories/slugs/${category}`);
    return response;
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  if (!params?.category) {
    return generatePageMetadata({
      title: "Category - CUMI Technology Blog",
      description: "Explore technology blog posts by category.",
      url: `${SITE_URL}/categories`
    });
  }

  const category = await fetchCategoryDetails(params.category);
  
  if (!category) {
    return generatePageMetadata({
      title: "Category - CUMI Technology Blog",
      description: "Explore technology blog posts by category.",
      url: `${SITE_URL}/categories`
    });
  }

  const baseUrl = SITE_URL;
  const categoryUrl = `${baseUrl}/categories/${params.category}`;
  const postImages = category.posts?.slice(0, 3).map((post: any) => ({
    url: post.imageUrl
      ? (post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}/uploads/posts/${post.imageUrl}`)
      : defaultImages[0],
    width: 800,
    height: 600,
    alt: post.title,
  })) || [{ url: defaultImages[0], width: 1200, height: 630, alt: category.name }];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Articles | CUMI Technology Blog`,
    description: category.description || `Discover articles in the ${category.name} category`,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Articles`,
      numberOfItems: category.posts?.length || 0,
      itemListElement: category.posts?.slice(0, 10).map((post: any, index: number) => ({
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
    title: `${category.name} Content | CUMI Technology Blog`,
    description: category.description || `Discover ${category.posts?.length || ""} articles in the ${category.name} category`,
    keywords: [
      "technology blog",
      "software development",
      "web development",
      "programming",
      "digital transformation",
      "tech articles",
      category.name,
      `${category.name} articles`,
      `${category.name} blog posts`,
      `posts about ${category.name}`,
    ].filter(Boolean),
    url: categoryUrl,
    alternates: {
      canonical: categoryUrl,
    },
    image: defaultImages[0],
    images: postImages,
    publishedTime: new Date(category.createdAt).toISOString(),
    modifiedTime: new Date(category.updatedAt).toISOString(),
    openGraph: {
      type: "website",
      title: `${category.name} Content Collection | CUMI Technology Blog`,
      description: category.description || `Discover ${category.posts?.length || ""} articles in the ${category.name} category`,
      images: postImages.map((img: { url: string }) => img.url),
      siteName: "CUMI",
      locale: "en_US",
      url: categoryUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Articles | CUMI Technology Blog`,
      description: `Explore ${category.posts?.length || ""} posts in the ${category.name} category`,
      images: [postImages[0]?.url || defaultImages[0]],
      creator: "@cumi_dev",
    },
    schema: collectionSchema,
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryDetailPageComponent category={params.category} />;
}
