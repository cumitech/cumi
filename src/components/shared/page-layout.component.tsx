"use client";

import React from "react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";

interface BreadcrumbItem {
  label: string;
  uri: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  showBanner?: boolean;
  bannerTitle?: string;
  bannerBreadcrumbs?: BreadcrumbItem[];
  className?: string;
  navLogoPath?: string;
  footerLogoPath?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showNav = true,
  showFooter = true,
  showBanner = false,
  bannerTitle,
  bannerBreadcrumbs,
  className = "",
  navLogoPath = "/",
  footerLogoPath = "/",
}) => {
  return (
    <>
      {showNav && (
        <div className="container-fluid" style={{ width: "100%" }}>
          <AppNav logoPath={navLogoPath} />
        </div>
      )}

{showBanner && bannerTitle && (
        <BannerComponent
          breadcrumbs={bannerBreadcrumbs || []}
          pageTitle={bannerTitle}
        />
      )}

<div id="page-content" className={className}>
        {children}
      </div>

{showFooter && (
        <>
          <AppFooter logoPath={footerLogoPath} />
          <AppFootnote />
        </>
      )}
    </>
  );
};

export default PageLayout;
