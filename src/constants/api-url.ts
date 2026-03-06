const getAppUrl = (): string => {
  // Priority 1: NEXT_PUBLIC_APP_URL (should be set in production)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Priority 2: NEXT_PUBLIC_SITE_URL (canonical site URL from env)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Priority 3: NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

export const APP_URL = getAppUrl();
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? APP_URL;

export const BASE_URL = `/api`;

