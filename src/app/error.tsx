'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "500 - Server Error",
            "description": "An unexpected error occurred on our server",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "mainEntity": {
              "@type": "Thing",
              "name": "500 Error",
              "description": "Internal server error"
            }
          })
        }}
      />
      <section className="py-5 text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-8 col-lg-6">
              <span className="display-1 fw-bold text-danger">
                500
              </span>
              <h1 className="h2 mb-4">Server Error</h1>
              <div className="mb-4">
                <p>
                  An unexpected error occurred on our server. We apologize for the inconvenience.
                  Please try again later or contact support if the problem persists.
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
                    <Link href="/contact-us" className="btn btn-outline-primary btn-sm">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  onClick={reset}
                  className="btn btn-primary"
                >
                  Try again
                </button>
                <Link href="/" className="btn btn-outline-primary">
                  Go home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
