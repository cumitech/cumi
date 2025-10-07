import { Metadata } from "next";
import MobileAppPageComponent from "../../components/page-components/mobile-app-page.component";
import { generatePageMetadata, defaultImages } from "../../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "CUMI Mobile App - Coming Soon | iOS & Android",
  description: "Get ready for the CUMI Mobile App! Access your complete LMS and Creator Dashboard on iOS and Android. Expected launch Q2 2025. Join our waitlist to be notified when we launch.",
  keywords: [
    "CUMI mobile app",
    "mobile learning app",
    "iOS app",
    "Android app",
    "LMS mobile",
    "creator dashboard mobile",
    "mobile education app",
    "learning management system mobile",
    "course app mobile",
    "mobile learning platform",
    "app coming soon",
    "mobile app waitlist",
    "educational mobile app",
    "online learning mobile",
    "mobile course platform"
  ],
  url: "https://cumi.dev/mobile-app",
  image: defaultImages[0],
  images: [
    {
      url: defaultImages[0],
      width: 1200,
      height: 630,
      alt: "CUMI Mobile App Coming Soon"
    }
  ],
  openGraph: {
    type: "website",
    title: "CUMI Mobile App - Coming Soon",
    description: "Get ready for the CUMI Mobile App! Access your complete LMS and Creator Dashboard on iOS and Android.",
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev/mobile-app"
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI Mobile App - Coming Soon",
    description: "Get ready for the CUMI Mobile App! Access your complete LMS and Creator Dashboard on iOS and Android.",
    images: [defaultImages[0]],
    creator: "@cumi_dev"
  }
});

export default function MobileAppPage() {
  return <MobileAppPageComponent />;
}