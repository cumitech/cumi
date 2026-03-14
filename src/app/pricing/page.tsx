import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import PricingPageComponent from "../../components/page-components/pricing-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/pricing", {
    title: "Pricing - CUMI Technology",
    description:
      "Transparent pricing for web and mobile development. Per project, custom, and enterprise options. Contact us for a quote.",
    keywords: ["pricing", "software development", "custom software", "enterprise", "quote", "CUMI"],
    url: `${SITE_URL}/pricing`,
    alternates: { canonical: `${SITE_URL}/pricing` },
    image: defaultImages[0],
    openGraph: {
      type: "website",
      title: "Pricing - CUMI Technology",
      description: "Per project, custom, and enterprise. Contact for a quote.",
      url: `${SITE_URL}/pricing`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Pricing - CUMI Technology",
      creator: "@cumi_dev",
    },
  });
}

export default function PricingPage() {
  return <PricingPageComponent />;
}
