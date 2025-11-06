'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <section className="py-5 text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-10 col-md-8 col-lg-6">
                <span className="display-1 fw-bold text-danger">
                  500
                </span>
                <h1 className="h2 mb-4">Global Server Error</h1>
                <div className="mb-4">
                  <p>
                    An unexpected global error occurred. We apologize for the inconvenience.
                    Please try again later or contact support if the problem persists.
                  </p>
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
      </body>
    </html>
  );
}
