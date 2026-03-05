import { SITE_URL } from '@constants/api-url';

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return SITE_URL;
};

