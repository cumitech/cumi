import { Metadata } from "next";
import TermsOfUsePageComponent from "../../components/page-components/terms-of-use-page.component";
import { generateDynamicPageMetadata, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/terms-of-use", {
  title: "Terms of Use - CUMI Technology",
  description: "Read our terms of use and service agreement for using CUMI Technology's platform, services, and mobile applications.",
  keywords: [
    "terms of use",
    "terms of service",
    "user agreement",
    "legal terms",
    "CUMI terms",
    "platform terms",
    "service agreement",
    "user conditions",
    "legal policy",
    "terms and conditions"
  ],
  url: "https://cumi.dev/terms-of-use",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Terms of Use"
    }
  ],
  openGraph: {
    type: "website",
    title: "Terms of Use - CUMI Technology",
    description: "Read our terms of use and service agreement for using CUMI Technology's platform and services.",
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/terms-of-use"
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use - CUMI Technology",
    description: "Read our terms of use and service agreement for using CUMI Technology's platform and services.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  }
  });
}

export default function TermsOfUsePage() {
  return <TermsOfUsePageComponent />;
}
