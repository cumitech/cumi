import { Metadata } from "next";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../../lib/seo";
import ForgotPasswordPageComponent from "../../../components/page-components/forgot-password-component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/auth/forgot-password", {
    title: "Forgot Password - Reset Your CUMI Account",
    description: "Reset your CUMI account password securely. Enter your email address to receive a password reset link. Secure password recovery for your learning platform account.",
    keywords: [
      "forgot password",
      "password reset",
      "CUMI password recovery",
      "account recovery",
      "reset password",
      "password help",
      "account access",
      "secure password reset",
      "email password reset",
      "user account recovery",
      "login help",
      "password assistance",
      "account security",
      "password recovery email",
      "reset account access",
      "forgot login",
      "password reset link",
      "account password help",
      "secure account recovery",
      "password reset process"
    ],
    url: "https://cumi.dev/auth/forgot-password",
    alternates: {
      canonical: "https://cumi.dev/auth/forgot-password"
    },
    image: defaultImages[0],
    images: [
      {
        url: defaultImages[0],
        width: 1200,
        height: 630,
        alt: "CUMI Password Reset - Secure Account Recovery"
      }
    ],
    openGraph: {
      type: "website",
      title: "Forgot Password - Reset Your CUMI Account",
      description: "Securely reset your CUMI account password. Enter your email to receive a password reset link and regain access to your account.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: "https://cumi.dev/auth/forgot-password"
    },
    twitter: {
      card: "summary_large_image",
      title: "Reset Your CUMI Password - Secure Recovery",
      description: "Forgot your CUMI password? Reset it securely by entering your email address to receive a password reset link.",
      images: [defaultImages[0]],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('webpage', {
      name: "Forgot Password - CUMI Account Recovery",
      description: "Secure password reset page for CUMI users to recover their account access",
      url: "https://cumi.dev/auth/forgot-password",
      isPartOf: {
        "@type": "WebSite",
        "name": "CUMI",
        "url": "https://cumi.dev"
      }
    })
  });
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageComponent />;
}