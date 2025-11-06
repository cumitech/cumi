import { Metadata } from "next";
import RegisterPageComponent from "@components/page-components/register-page.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/register", {
    title: "Register - Create Your CUMI Account",
    description: "Join CUMI and create your account to access our technology courses, events, and career opportunities. Start your journey in software development and digital innovation.",
    keywords: [
      "register",
      "create account",
      "sign up",
      "join CUMI",
      "user registration",
      "account creation",
      "technology platform",
      "software development community",
      "digital learning platform",
      "tech education registration",
      "member registration",
      "new user signup",
      "community join",
      "platform registration",
      "free account creation"
    ],
    url: "https://cumi.dev/register",
    alternates: {
      canonical: "https://cumi.dev/register"
    },
    image: defaultImages[0],
    images: [
      {
        url: defaultImages[0],
        width: 1200,
        height: 630,
        alt: "CUMI Register - Create Your Account"
      }
    ],
    openGraph: {
      type: "website",
      title: "Register for CUMI - Create Your Account",
      description: "Join CUMI and create your account to access technology courses, events, and career opportunities. Start your journey in software development and digital innovation.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: "https://cumi.dev/register"
    },
    twitter: {
      card: "summary_large_image",
      title: "Register for CUMI - Create Your Account",
      description: "Join CUMI and create your account to access technology courses, events, and career opportunities.",
      images: [defaultImages[0]],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('webpage', {
      name: "Register - CUMI Account Creation",
      description: "User registration page for CUMI platform to create new accounts and join the community",
      url: "https://cumi.dev/register",
      isPartOf: {
        "@type": "WebSite",
        "name": "CUMI",
        "url": "https://cumi.dev"
      }
    })
  });
}

export default function RegisterPage() {
  return <RegisterPageComponent />;
}
