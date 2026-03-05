import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import LoginFormComponent from "@components/page-components/login-form.component";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/login", {
    title: "Login - Access Your CUMI Account",
    robots: { index: false, follow: false },
    description: "Sign in to your CUMI account to access courses, events, career opportunities, and the latest technology insights. Join our community of software developers and digital innovators.",
    keywords: [
      "login",
      "sign in",
      "user login",
      "account access",
      "CUMI login",
      "technology platform login",
      "software development community",
      "digital learning platform",
      "tech education access",
      "member login",
      "user authentication",
      "secure login",
      "platform access",
      "account sign in",
      "community access"
    ],
    url: `${SITE_URL}/login`,
    alternates: {
      canonical: `${SITE_URL}/login`
    },
    image: defaultImages[0],
    images: [
      {
        url: defaultImages[0],
        width: 1200,
        height: 630,
        alt: "CUMI Login - Access Your Account"
      }
    ],
    openGraph: {
      type: "website",
      title: "Login to CUMI - Access Your Account",
      description: "Sign in to your CUMI account to access courses, events, and technology insights. Join our community of software developers and digital innovators.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: `${SITE_URL}/login`
    },
    twitter: {
      card: "summary_large_image",
      title: "Login to CUMI - Access Your Account",
      description: "Sign in to your CUMI account to access courses, events, and technology insights.",
      images: [defaultImages[0]],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('webpage', {
      name: "Login - CUMI Account Access",
      description: "Secure login page for CUMI users to access their accounts and personalized learning experience",
      url: `${SITE_URL}/login`,
      isPartOf: {
        "@type": "WebSite",
        "name": "CUMI",
        "url": SITE_URL
      }
    })
  });
}

export default function LoginPage() {
  return <LoginFormComponent />;
}

