// Get the app URL with proper fallback logic
// In production, this should NEVER be localhost
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

// Canonical site URL for metadata, schema, canonical links, etc.
// Set NEXT_PUBLIC_SITE_URL in .env (e.g. https://cumi.dev)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'https://cumi.dev';

export const TINYMCE_KEY = `jmee0ymvhn8xuoj51dz5vzj032x5887fw5aa4yojvi9pu68z`;

export const BASE_URL = `/api`;

