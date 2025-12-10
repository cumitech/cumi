import { Metadata } from "next";
import CourseDetailPageComponent from "@components/page-components/course-detail-page.component";
import { generatePageMetadata, generateStructuredData, fetchApiData, defaultImages } from "../../../lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

interface CourseDetailPageProps {
  params: { slug: string };
}

// Fetch course details for SEO
const fetchCourseDetails = async (slug: string) => {
  try {
    const response = await fetchApiData(`/api/courses/slugs/${slug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching course ${slug}:`, error);
    return null;
  }
};

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
  if (!params?.slug) {
    return generatePageMetadata({
      title: "Course - CUMI Technology Courses",
      description: "Learn with CUMI's technology courses and training programs.",
      url: "https://cumi.dev/courses"
    });
  }

  const course = await fetchCourseDetails(params.slug);
  
  if (!course) {
    return generatePageMetadata({
      title: "Course - CUMI Technology Courses",
      description: "Learn with CUMI's technology courses and training programs.",
      url: "https://cumi.dev/courses"
    });
  }

  return generatePageMetadata({
    title: `${course.title} - CUMI Technology Course`,
    description: course.description || `Learn ${course.title} with CUMI's comprehensive course. Master software development, web technologies, and digital skills.`,
    keywords: [
      "technology courses",
      "software development training",
      "web development courses",
      "programming tutorials",
      "tech education",
      "digital skills training",
      "mobile app development courses",
      "cloud computing training",
      "API development courses",
      "database design training",
      "user experience design courses",
      "responsive web design training",
      "e-commerce development courses",
      "DevOps training",
      "business automation courses",
      "technology certification",
      "IT training programs",
      "online tech courses",
      "programming bootcamp",
      course.title,
      course.category,
      course.difficulty
    ].filter(Boolean),
    url: `https://cumi.dev/courses/${params.slug}`,
    alternates: {
      canonical: `https://cumi.dev/courses/${params.slug}`,
    },
    images: course.imageUrl ? [{
      url: course.imageUrl,
      width: 1200,
      height: 630,
      alt: course.title,
    }] : [{
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Course",
    }],
    publishedTime: new Date(course.createdAt).toISOString(),
    modifiedTime: new Date(course.updatedAt).toISOString(),
    // OpenGraph
    openGraph: {
      type: "website",
      title: `${course.title} - CUMI Technology Course`,
      description: course.description || `Learn ${course.title} with CUMI's comprehensive course.`,
      images: course.imageUrl ? [course.imageUrl] : [defaultImages[2]],
      siteName: "CUMI",
      locale: "en_US",
      url: `https://cumi.dev/courses/${params.slug}`,
    },
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: `${course.title} - CUMI Technology Course`,
      description: course.description || `Learn ${course.title} with CUMI's comprehensive course.`,
      images: course.imageUrl ? [course.imageUrl] : [defaultImages[2]],
      creator: "@cumi_dev",
    },
    // Structured data
    schema: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": course.title,
      "description": course.description,
      "provider": {
        "@type": "Organization",
        "name": "CUMI",
        "url": "https://cumi.dev",
        "logo": "https://cumi.dev/img/cumi-green.jpg"
      },
      "courseMode": course.isOnline ? "online" : "blended",
      "educationalLevel": course.difficulty || "beginner",
      "coursePrerequisites": course.prerequisites,
      "syllabusSections": course.lessons?.map((lesson: any) => ({
        "@type": "Syllabus",
        "name": lesson.title,
        "description": lesson.description
      })) || [],
      "offers": course.price ? {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      } : {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "image": course.imageUrl || defaultImages[2],
      "inLanguage": "en",
      "teaches": course.objectives,
      "timeRequired": course.duration
    },
  });
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const course = await fetchCourseDetails(params.slug);
  
  const courseSchema = course ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "CUMI",
      "url": "https://cumi.dev",
      "logo": "https://cumi.dev/img/cumi-green.jpg"
    },
    "courseMode": course.isOnline ? "online" : "blended",
    "educationalLevel": course.difficulty || "beginner",
    "coursePrerequisites": course.prerequisites,
    "syllabusSections": course.lessons?.map((lesson: any) => ({
      "@type": "Syllabus",
      "name": lesson.title,
      "description": lesson.description
    })) || [],
    "offers": course.price ? {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    } : {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "image": course.imageUrl || defaultImages[2],
    "inLanguage": "en",
    "teaches": course.objectives,
    "timeRequired": course.duration
  } : null;

  return (
    <>
      {courseSchema && (
        <SchemaRenderer 
          schemas={courseSchema} 
          includeDefaults={false}
        />
      )}
      <CourseDetailPageComponent courseSlug={params.slug} />
    </>
  );
}
