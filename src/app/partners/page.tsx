import { Metadata } from "next";
import PartnersPageComponent from "@/components/page-components/partners-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/partners", {
  title: "Our Partners - CUMI Trusted Collaborations",
  description: "Meet CUMI's trusted partners and collaborators. We work with industry-leading organizations to deliver exceptional solutions and drive innovation together.",
  keywords: [
    "business partners",
    "strategic partnerships",
    "technology collaborations",
    "industry partners",
    "trusted partners",
    "business collaborations",
    "partner ecosystem",
    "strategic alliances",
    "partner network"
  ],
  url: "https://cumi.dev/partners",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Partners"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Trusted Partners",
    description: "We collaborate with industry-leading organizations to deliver exceptional solutions and drive innovation together.",
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/partners"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Trusted Partners",
    description: "We collaborate with industry-leading organizations to deliver exceptional solutions.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  },
  schema: generateStructuredData("organization", {
    name: "CUMI Partners",
    description: "CUMI's network of trusted partners and collaborators across the technology industry",
    url: "https://cumi.dev/partners"
  }),
  });
}

export default function PartnersPage() {
  return <PartnersPageComponent />;
}


