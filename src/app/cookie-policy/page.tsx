import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import CookiePolicyPageComponent from "../../components/page-components/cookie-policy-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/cookie-policy", {
    title: "Cookie Policy - CUMI Technology",
    description:
      "Learn how CUMI uses cookies and similar technologies. Manage your preferences and understand your choices.",
    keywords: [
      "cookie policy",
      "cookies",
      "tracking",
      "privacy",
      "CUMI",
      "website cookies",
      "browser cookies",
    ],
    url: `${SITE_URL}/cookie-policy`,
    alternates: { canonical: `${SITE_URL}/cookie-policy` },
    image: defaultImages[0],
    images: [
      { url: defaultImages[0], width: 1200, height: 630, alt: "CUMI Cookie Policy" },
    ],
    openGraph: {
      type: "website",
      title: "Cookie Policy - CUMI Technology",
      description: "How we use cookies and how you can manage your preferences.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: `${SITE_URL}/cookie-policy`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Cookie Policy - CUMI Technology",
      description: "How we use cookies and how you can manage your preferences.",
      images: [defaultImages[0]],
      creator: "@cumi_dev",
    },
  });
}

export default function CookiePolicyPage() {
  return <CookiePolicyPageComponent />;
}
