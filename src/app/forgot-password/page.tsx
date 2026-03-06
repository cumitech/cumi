import { Metadata } from "next";
import { SITE_URL } from "@constants/api-url";
import ForgotPasswordComponent from "@components/page-components/forgot-password.component";
import { generatePageMetadata, defaultImages } from "../../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Forgot Password - Reset Your CUMI Account Password",
  description: "Reset your CUMI account password securely. Enter your email address and we'll send you a link to reset your password and regain access to your account.",
  keywords: [
    "forgot password",
    "password reset",
    "reset password",
    "CUMI account",
    "password recovery",
    "account access",
    "secure password reset",
    "email verification",
    "user authentication",
  ],
  url: `${SITE_URL}/forgot-password`,
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/forgot-password` },
  image: defaultImages[0],
  images: [
    { url: defaultImages[0], width: 1200, height: 630, alt: "CUMI Forgot Password" },
  ],
  openGraph: {
    type: "website",
    title: "Forgot Password - Reset Your CUMI Account",
    description: "Reset your CUMI account password securely. Enter your email and we'll send you a reset link.",
    images: [defaultImages[0]],
    siteName: "CUMI",
    locale: "en_US",
    url: `${SITE_URL}/forgot-password`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Forgot Password - CUMI Account",
    description: "Reset your CUMI account password securely.",
    images: [defaultImages[0]],
    creator: "@cumi_dev",
  },
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordComponent />;
}

