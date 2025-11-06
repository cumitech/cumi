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

      {/* 5. QUICK NAVIGATION - Internal links for SEO */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-4">
            <h3 className="mb-3">Explore Our Services & Solutions</h3>
            <p className="text-muted">Discover how we can help transform your business with our comprehensive digital solutions</p>
          </div>
          <div className="col-12">
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <a href="/our-services" className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm text-center p-3">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Our Services</h6>
                      <small className="text-muted">Web & Mobile Development</small>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-6 col-md-3">
                <a href="/projects" className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm text-center p-3">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Projects</h6>
                      <small className="text-muted">Our Latest Work</small>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-6 col-md-3">
                <a href="/courses" className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm text-center p-3">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Courses</h6>
                      <small className="text-muted">Learn & Grow</small>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-6 col-md-3">
                <a href="/contact-us" className="text-decoration-none">
                  <div className="card h-100 border-0 shadow-sm text-center p-3">
                    <div className="card-body">
                      <h6 className="card-title text-primary">Contact Us</h6>
                      <small className="text-muted">Get In Touch</small>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. CALL TO ACTION - Get started */}
      <AppService />

      {/* 7. PARTNERS & TRUST - Social proof */}
      <PartnersSection />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
