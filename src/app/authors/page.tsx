import { Metadata } from "next";
import AuthorsPageComponent from "@components/page-components/authors-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/authors", {
  title: "Authors - CUMI Technology Blog Writers & Contributors",
  description: "Meet the talented authors and contributors behind CUMI's technology blog. Discover expert insights on software development, web technologies, digital transformation, and industry best practices.",
  keywords: [
    "technology blog authors",
    "software development writers",
    "web development experts",
    "tech industry contributors",
    "programming blog writers",
    "digital transformation experts",
    "technology thought leaders",
    "software engineering authors",
    "web technology specialists",
    "mobile development experts",
    "cloud computing writers",
    "API development specialists",
    "database design experts",
    "user experience designers",
    "responsive web design experts",
    "e-commerce development specialists",
    "DevOps experts",
    "business automation specialists",
    "tech industry insights",
    "development best practices writers"
  ],
  url: "https://cumi.dev/authors",
  image: defaultImages[1],
  images: [
    {
      url: defaultImages[1],
      width: 1200,
      height: 630,
      alt: "CUMI Technology Blog Authors"
    },
    {
      url: defaultImages[2],
      width: 1200,
      height: 630,
      alt: "CUMI Expert Contributors"
    }
  ],
  openGraph: {
    type: "website",
    title: "Authors - CUMI Technology Blog Contributors",
    description: "Meet the expert authors and contributors behind CUMI's technology blog, sharing insights on software development and digital transformation.",
    images: [defaultImages[1], defaultImages[2]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/authors"
  },
  twitter: {
    card: "summary_large_image",
    title: "Authors - CUMI Technology Blog",
    description: "Meet the expert authors and contributors behind CUMI's technology blog, sharing insights on software development and digital transformation.",
    images: [defaultImages[1]],
    creator: "@cumi_dev"
  },
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CUMI Technology Blog Authors",
    "description": "Collection of expert authors and contributors writing about technology, software development, and digital transformation",
    "url": "https://cumi.dev/authors",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Technology Blog Authors",
      "description": "Expert contributors and authors writing about software development and technology"
    }
  }
  });
}

export default function AuthorsPage() {
  return <AuthorsPageComponent />;
}

