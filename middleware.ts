import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware logic runs after authentication check
    console.log(`[Middleware] Authenticated route: ${req.nextUrl.pathname}`);
  },
  {
    pages: {
      signIn: "/login",
      error: "/error",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Check if it's an admin-only route
        if (pathname.startsWith('/dashboard/admin')) {
          return token?.role === "admin";
        }
        
        // All other dashboard routes require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token;
        }
        
        // Public API endpoints that don't require authentication
        const publicAPIs = [
          '/api/auth',
          '/api/public-stats',
          '/api/public-partners',
          '/api/services',
          '/api/partners',
          '/api/categories',
          '/api/posts',
          '/api/subscribe',
          '/api/contact-messages',
          '/api/cloudinary',
          '/api/uploads',
          '/api/media',
        ];
        const isPublicAPI = publicAPIs.some(path => pathname.startsWith(path));
        
        if (isPublicAPI) {
          return true; // Allow access without authentication
        }
        
        // Admin-only API endpoints
        const adminOnlyAPIs = ['/api/users', '/api/admin', '/api/stats'];
        const isAdminAPI = adminOnlyAPIs.some(path => pathname.startsWith(path));
        
        if (isAdminAPI) {
          return token?.role === "admin";
        }
        
        // Auth-required API endpoints
        const protectedAPIs = ['/api/enrollments', '/api/submissions', '/api/current'];
        const isProtectedAPI = protectedAPIs.some(path => pathname.startsWith(path));
        
        if (isProtectedAPI) {
          return !!token;
        }
        
        // Default: allow (for other API endpoints that have their own auth logic)
        return true;
      },
    },
  }
);

export const config = {
  // Match all dashboard and API routes
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
