import { Metadata } from "next";
import PrivacyPolicyPageComponent from "../../components/page-components/privacy-policy-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/privacy-policy", {
  title: "Privacy Policy - CUMI Technology",
  description: "Learn how CUMI Technology collects, uses, and protects your personal information. Read our comprehensive privacy policy.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "privacy rights",
    "CUMI privacy",
    "data collection",
    "user privacy",
    "information security",
    "privacy practices",
    "data usage"
  ],
  url: "https://cumi.dev/privacy-policy",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Privacy Policy"
    }
  ],
  openGraph: {
    type: "website",
    title: "Privacy Policy - CUMI Technology",
    description: "Learn how CUMI Technology collects, uses, and protects your personal information.",
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/privacy-policy"
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - CUMI Technology",
    description: "Learn how CUMI Technology collects, uses, and protects your personal information.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  }
  });
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageComponent />;
}
