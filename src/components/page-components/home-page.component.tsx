"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import FeatureSection from "@components/feature-section/feature-section";
import AboutNote from "@components/about-note/about-note";
import { AppNav } from "@components/nav/nav.component";
import { AppHero } from "@components/hero/hero.component";
import { AppService } from "@components/service/service.component";
import { AppCTA } from "@components/CTA.component";
import { PartnersSection } from "@components/partners/partners-section.component";
import { ServicesSection } from "@components/services/services-section.component";
import LeadMagnetSection from "@components/lead-magnet/lead-magnet-section";
import TestimonialsSection from "@components/testimonials/testimonials-section";
import StatsSection from "@components/stats/stats-section";
import ProcessFlowSection from "@components/process-flow/process-flow-section";
import WhoWeHelpSection from "@components/who-we-help/who-we-help-section";
import Subscribe from "@components/subscribe/subscribe";

export default function HomePageComponent() {
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
        <AppHero />
      </div>

      {/* Who we help */}
      <WhoWeHelpSection />

      {/* 1. COMPANY INTRODUCTION - Who we are */}
      <AboutNote />

      {/* 2. CORE BUSINESS - What we do (Software Development) */}
      <FeatureSection />

      {/* 3. OUR SERVICES - Detailed service offerings */}
      <ServicesSection showViewAllButton={true} showContainer={true} />

      {/* 4. STATS - Impact in numbers */}
      <StatsSection />

      {/* 5. WORK PROCESS FLOW */}
      <ProcessFlowSection />

      {/* 6. LEAD MAGNET - Services guide CTA */}
      <LeadMagnetSection />

      {/* 7. TESTIMONIALS - Social proof */}
      <TestimonialsSection />

      {/* 8. PARTNERS & TRUST - Logos / As seen in */}
      <PartnersSection />

      {/* 10. CALL TO ACTION - Get started */}
      <AppService />

      {/* 11. CTA - Let's work together / Get quote */}
      <AppCTA />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
