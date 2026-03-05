import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import { generateDynamicPageMetadata, generateStructuredData, defaultImages } from "../../../lib/seo";
import ResetPasswordPageComponent from "../../../components/page-components/reset-password-component";

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicPageMetadata("/auth/reset-password", {
    title: "Reset Password - Create New CUMI Account Password",
    description: "Create a new secure password for your CUMI account. Reset your password using the secure token sent to your email. Strong password requirements for account security.",
    keywords: [
      "reset password",
      "new password",
      "CUMI password reset",
      "create new password",
      "secure password",
      "password change",
      "account security",
      "password update",
      "reset account password",
      "new account password",
      "secure password creation",
      "password strength",
      "account password reset",
      "user password change",
      "password security",
      "strong password",
      "password requirements",
      "account access recovery",
      "password reset token",
      "secure password reset"
    ],
    url: `${SITE_URL}/auth/reset-password`,
    alternates: {
      canonical: `${SITE_URL}/auth/reset-password`
    },
    image: defaultImages[0],
    images: [
      {
        url: defaultImages[0],
        width: 1200,
        height: 630,
        alt: "CUMI Password Reset - Create New Secure Password"
      }
    ],
    openGraph: {
      type: "website",
      title: "Reset Password - Create New CUMI Account Password",
      description: "Create a new secure password for your CUMI account using the reset token. Follow our security guidelines for a strong password.",
      images: [defaultImages[0]],
      siteName: "CUMI",
      locale: "en_US",
      url: `${SITE_URL}/auth/reset-password`
    },
    twitter: {
      card: "summary_large_image",
      title: "Reset Your CUMI Password - Secure Password Creation",
      description: "Create a new secure password for your CUMI account. Follow our guidelines for strong password security.",
      images: [defaultImages[0]],
      creator: "@cumi_dev"
    },
    schema: generateStructuredData('webpage', {
      name: "Reset Password - CUMI Account Security",
      description: "Secure password reset page for CUMI users to create a new password for their account",
      url: `${SITE_URL}/auth/reset-password`,
      isPartOf: {
        "@type": "WebSite",
        "name": "CUMI",
        "url": SITE_URL
      }
    })
  });
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageComponent />;
}