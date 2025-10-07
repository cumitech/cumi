"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import FeatureSection from "@components/feature-section/feature-section";
import AboutNote from "@components/about-note/about-note";
import { AppNav } from "@components/nav/nav.component";
import { AppHero } from "@components/hero/hero.component";
import { AppService } from "@components/service/service.component";
import { PartnersSection } from "@components/partners/partners-section.component";
import { ServicesSection } from "@components/services/services-section.component";
import {
  LMSShowcaseSection,
} from "@components/lms-features";

export default function HomePageComponent() {
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
        <AppHero />
      </div>

      {/* 1. COMPANY INTRODUCTION - Who we are */}
      <AboutNote />

      {/* 2. CORE BUSINESS - What we do (Software Development) */}
      <FeatureSection />

      {/* 3. OUR SERVICES - Detailed service offerings */}
      <ServicesSection showViewAllButton={true} showContainer={true} />

      {/* 4. PLATFORM FEATURES - Creator tools showcase */}
      <LMSShowcaseSection />

      {/* 8. CALL TO ACTION - Get started */}
      <AppService />

      {/* 7. PARTNERS & TRUST - Social proof */}
      <PartnersSection />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
