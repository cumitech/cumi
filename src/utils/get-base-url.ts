export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/http:\/\/localhost:3000/gi, 'https://cumi.dev');
  }
  
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/http:\/\/localhost:3000/gi, 'https://cumi.dev');
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://cumi.dev';
  }
  
  return 'http://localhost:3000';
};

