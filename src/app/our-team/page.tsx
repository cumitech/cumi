import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import OurTeamPageComponent from "@components/page-components/our-team-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "@lib/seo";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/our-team", {
    title: "Our team - CUMI",
    description: "Meet the people behind CUMI. Our team brings together expertise in software development, design, and digital solutions.",
    keywords: ["team", "CUMI team", "software team", "developers", "digital agency team"],
    url: `${SITE_URL}/our-team`,
    image: defaultImages[0],
    openGraph: {
      type: "website",
      title: "Our team - CUMI",
      description: "Meet the people behind CUMI.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      url: `${SITE_URL}/our-team`,
    },
    schema: generateStructuredData("organization", {
      name: "CUMI Team",
      description: "The team behind CUMI digital agency",
      url: `${SITE_URL}/our-team`,
    }),
  });
}

export default function OurTeamPage() {
  const schema = generateStructuredData("organization", {
    name: "CUMI Team",
    description: "The team behind CUMI digital agency",
    url: `${SITE_URL}/our-team`,
  });

  return (
    <>
      <SchemaRenderer schemas={schema} includeDefaults={false} />
      <OurTeamPageComponent />
    </>
  );
}
