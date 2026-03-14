import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import "../styles/app.scss";
import "../styles/home.scss";
import "../styles/nav-responsive.css";
import { RefineContext } from "@contexts/refine-context";
import { getLocale, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  generateStructuredData,
  defaultImages,
} from "../lib/seo";
import { SITE_URL } from "@constants/api-url";
import Script from "next/script";
import TawkChat from "@components/shared/tawk.component";
import SchemaRenderer from "@components/shared/schema-renderer.component";

export const metadata: Metadata = generatePageMetadata({
  title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
  description:
    "CUMI is a digital agency that helps businesses scale. We build web apps, mobile apps, and custom software for small businesses and enterprises.",
  url: SITE_URL,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  keywords: [
    "software development company",
    "web development services",
    "mobile app development",
    "digital transformation",
    "custom software solutions",
    "technology consulting",
    "full-stack development",
    "cloud solutions",
    "API development",
    "database design",
    "user experience design",
    "responsive web design",
    "e-commerce development",
    "content management systems",
    "progressive web apps",
    "business automation",
    "IT consulting services",
  ],
  image: defaultImages[0],
  images: defaultImages.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: "CUMI - Digital Agency for Business Growth",
  })),
  openGraph: {
    type: "website",
    title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
    description:
      "Digital agency helping businesses scale. Web apps, mobile apps, and custom software for small businesses and enterprises.",
    images: defaultImages,
    siteName: "CUMI",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI - Digital Agency | Software Solutions for Scaling Businesses",
    description:
      "Digital agency helping businesses scale. Custom software for small businesses and enterprises.",
    images: defaultImages,
    creator: "@cumi_dev",
  },
  schema: [
    generateStructuredData("organization", {}),
    generateStructuredData("website", {}),
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en" data-theme={defaultMode} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />

        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://va.tawk.to" />

        <link
          rel="preload"
          href={`${SITE_URL}/logo-shadow-png.png`}
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href={`${SITE_URL}/img/IMG_4491-min.jpeg`}
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="preconnect" href="https://api.whatsapp.com" />

        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        <meta name="theme-color" content="#15b9a1" />
        <meta name="msapplication-TileColor" content="#15b9a1" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta
          name="google-site-verification"
          content="-Wd8fKDKl_Wf1PAeTRbtVhGL8aSHeX0UwMXPllDsrsM"
        />

        {/* Image optimization hints */}
        <meta name="image-rendering" content="auto" />
        <meta name="color-scheme" content="light dark" />

        {/* Favicon - Multiple sizes for all devices */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />

        {/* Standard Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Manifest and Theme */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        {/* reCAPTCHA Enterprise */}
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
          }`}
          strategy="afterInteractive"
        />
        {/* Google Analytics (gtag.js) - in head for GA verification */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NQMGMJT42W"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQMGMJT42W');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T336R27S');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>

      <body cz-shortcut-listen="false">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T336R27S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <SchemaRenderer
          schemas={[
            generateStructuredData("organization", {}),
            generateStructuredData("website", {}),
          ]}
          includeDefaults={false}
        />

        <Suspense fallback={null}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <RefineContext defaultMode={defaultMode}>{children}</RefineContext>
          </NextIntlClientProvider>
        </Suspense>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
          defer
        ></script>
        <TawkChat />
      </body>
    </html>
  );
}
