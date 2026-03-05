import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import { generatePageMetadata, generateStructuredData, defaultImages } from "../../../lib/seo";

const SAMPLE_POST = {
  title: "How to Build Your First Website: A Complete Guide",
  description:
    "Building your first website can seem overwhelming, but with the right tools and guidance, anyone can create a professional-looking site. A comprehensive guide to get started with web development.",
  slug: "sample-post",
};

export const metadata: Metadata = generatePageMetadata({
  title: `${SAMPLE_POST.title} - CUMI Technology Blog`,
  description: SAMPLE_POST.description,
  keywords: [
    "build first website",
    "web development guide",
    "website builder",
    "domain and hosting",
    "CMS",
    "responsive design",
    "SEO",
    "web design",
  ],
  url: "`${SITE_URL}/blog-posts/sample-post`",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: SAMPLE_POST.title,
    },
  ],
  alternates: {
    canonical: "`${SITE_URL}/blog-posts/sample-post`",
  },
  openGraph: {
    type: "article",
    title: SAMPLE_POST.title,
    description: SAMPLE_POST.description,
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "`${SITE_URL}/blog-posts/sample-post`",
  },
  twitter: {
    card: "summary_large_image",
    title: SAMPLE_POST.title,
    description: SAMPLE_POST.description,
    images: [defaultImages[0]],
    creator: "@cumi_dev",
  },
  schema: generateStructuredData("blogPost", {
    title: SAMPLE_POST.title,
    description: SAMPLE_POST.description,
    imageUrl: null,
    authorName: "CUMI Team",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: SAMPLE_POST.slug,
  }),
});

export default function SamplePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
