"use client";

import { ErrorComponent } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { Suspense } from "react";

import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "The page you are looking for could not be found",
            "mainEntity": {
              "@type": "Thing",
              "name": "404 Error",
              "description": "Page not found error"
            }
          })
        }}
      />
      <Suspense>
        <section className="py-5 text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-6">
                <span className="display-1 fw-bold text-dark">
                  404
                </span>
                <h1 className="h2 mb-4">Page not found</h1>
                <div className="mb-4">
                  <p>
                    The page you are looking for might have been removed, had its
                    name changed, or is temporarily unavailable.
                  </p>
                </div>
                
                {/* Navigation Links */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h3 className="h5 mb-3">Popular Pages</h3>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <Link href="/" className="btn btn-outline-primary btn-sm">
                        Home
                      </Link>
                      <Link href="/about-us" className="btn btn-outline-primary btn-sm">
                        About Us
                      </Link>
                      <Link href="/our-services" className="btn btn-outline-primary btn-sm">
                        Services
                      </Link>
                      <Link href="/blog-posts" className="btn btn-outline-primary btn-sm">
                        Blog
                      </Link>
                      <Link href="/projects" className="btn btn-outline-primary btn-sm">
                        Projects
                      </Link>
                      <Link href="/courses" className="btn btn-outline-primary btn-sm">
                        Courses
                      </Link>
                      <Link href="/contact-us" className="btn btn-outline-primary btn-sm">
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>

                <Link href="/" className="btn btn-primary mt-3">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Suspense>
    </>
  );
};

export default NotFound;

