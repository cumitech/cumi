import { Metadata } from "next";
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
      url: "https://cumi.dev/categories"
    });
  }

  const category = await fetchCategoryDetails(params.category);
  
  if (!category) {
    return generatePageMetadata({
      title: "Category - CUMI Technology Blog",
      description: "Explore technology blog posts by category.",
      url: "https://cumi.dev/categories"
    });
  }

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
      category.name,
      ...(category.posts?.slice(0, 3).map((post: any) => post.title.split(" ")) || []).flat(),
      `${category.name} articles`,
      `${category.name} blog posts`,
      `posts about ${category.name}`
    ].filter(Boolean),
    url: `https://cumi.dev/categories/${params.category}`,
    alternates: {
      canonical: `https://cumi.dev/categories/${params.category}`,
    },
    images: category.posts?.slice(0, 3).map((post: any) => ({
      url: post.imageUrl || defaultImages[0],
      width: 800,
      height: 600,
      alt: post.title,
    })) || [defaultImages[0]],
    publishedTime: new Date(category.createdAt).toISOString(),
    modifiedTime: new Date(category.updatedAt).toISOString(),
    // OpenGraph
    openGraph: {
      type: "website",
      title: `${category.name} Content Collection`,
      description: `${category.posts?.length || ""} articles in the ${category.name} category`,
      images: [defaultImages[0], defaultImages[1]],
      siteName: "CUMI",
      locale: "en_US",
      url: "https://cumi.dev",
    },
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: `#${category.name} Articles`,
      description: `Explore ${category.posts?.length || ""} posts in the ${category.name} category`,
      images: [defaultImages[0]],
      creator: "@cumi_dev",
    },
    // Structured data
    schema: {
      collectionPage: {
        name: `${category.name} Articles`,
        about: category.name,
        description: `Collection of content in the ${category.name} category`,
        hasPart: category.posts?.map((post: any) => ({
          "@type": "BlogPosting",
          name: post.title,
          url: `https://cumi.dev/blog-posts/${post.slug}`,
          keywords: category.name,
        })) || [],
      },
      // Add category schema for better topic recognition
      category: {
        "@type": "Thing",
        name: category.name,
        url: `https://cumi.dev/categories/${params.category}`,
      },
    },
  });
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryDetailPageComponent category={params.category} />;
}
