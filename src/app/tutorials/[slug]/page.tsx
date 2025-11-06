import { Metadata } from "next";
import TutorialDetailPageComponent from "@components/page-components/tutorial-detail-page.component";
import { generatePageMetadata, generateStructuredData, defaultImages } from "../../../lib/seo";

interface TutorialDetailPageProps {
  params: { slug: string };
}

// Fetch tutorial details for SEO
const fetchTutorialDetails = async (slug: string) => {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/slugs/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch tutorial details");
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching tutorial ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: TutorialDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Tutorial - CUMI Learning Guides",
      description: "Explore our comprehensive tutorials and learning resources.",
      url: "https://cumi.dev/tutorials"
    });
  }

  const tutorial = await fetchTutorialDetails(params.slug);
  
  if (!tutorial) {
    return generatePageMetadata({
      title: "Tutorial - CUMI Learning Guides",
      description: "Explore our comprehensive tutorials and learning resources.",
      url: `https://cumi.dev/tutorials/${params.slug}`
    });
  }

  const tutorialImage = tutorial.imageUrl 
    ? `${process.env.NEXTAUTH_URL}/uploads/posts/${tutorial.imageUrl}`
    : defaultImages[0];

  const keywords = [
    "tutorial",
    "programming tutorial",
    "step-by-step guide",
    "learn programming",
    "software development tutorial",
    tutorial.title,
    ...(tutorial.tags?.map((tag: any) => tag.name) || []),
    ...(tutorial.category?.name ? [tutorial.category.name] : [])
  ];

  return generatePageMetadata({
    title: `${tutorial.title} - CUMI Tutorial`,
    description: tutorial.description || `Learn with our step-by-step tutorial: ${tutorial.title}. Master software development through our comprehensive guides.`,
    keywords,
    url: `https://cumi.dev/tutorials/${params.slug}`,
    image: tutorialImage,
    images: [
      {
        url: tutorialImage,
        width: 1200,
        height: 630,
        alt: tutorial.title
      }
    ],
    publishedTime: new Date(tutorial.createdAt).toISOString(),
    modifiedTime: new Date(tutorial.updatedAt).toISOString(),
    alternates: {
      canonical: `https://cumi.dev/tutorials/${params.slug}`
    },
    openGraph: {
      type: "article",
      title: tutorial.title,
      description: tutorial.description || `Learn with our step-by-step tutorial: ${tutorial.title}`,
      images: [tutorialImage],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/tutorials/${params.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title: tutorial.title,
      description: tutorial.description || `Learn with our step-by-step tutorial: ${tutorial.title}`,
      images: [tutorialImage],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('article', {
      title: tutorial.title,
      description: tutorial.description,
      imageUrl: tutorial.imageUrl,
      authorName: tutorial.authorName,
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      slug: params.slug
    })
  });
}

export default function TutorialDetailPage({ params }: TutorialDetailPageProps) {
  return <TutorialDetailPageComponent slug={params.slug} />;
}

