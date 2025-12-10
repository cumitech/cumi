'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function TawkChat() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || !process.env.NEXT_PUBLIC_TAWK_WIDGET_ID) {
      console.warn('Tawk.to widget is not configured.');
      return;
    }

    if (document.querySelector(`script[src*="embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}"]`)) {
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    window.Tawk_API.onLoad = function() {
      console.log('Tawk.to widget loaded');
    };

    window.Tawk_API.onError = function(error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Tawk.to widget error:', error);
      }
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID}/${process.env.NEXT_PUBLIC_TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.crossOrigin = 'anonymous';
    
    script.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load Tawk.to script');
      }
    };

    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script);
    }

    return () => {
      if (script.parentNode && script.onerror) {
        script.onerror = null;
      }
    };
  }, []);

  return null;
}