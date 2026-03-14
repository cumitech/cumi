/**
 * Client-side: get reCAPTCHA Enterprise token for the given action.
 * Call this before submitting public forms.
 */
export function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined" || !(window as any).grecaptcha?.enterprise) {
    return Promise.resolve("");
  }
  return new Promise((resolve) => {
    (window as any).grecaptcha.enterprise.ready(() => {
      (window as any).grecaptcha.enterprise
        .execute(siteKey, { action })
        .then((token: string) => resolve(token))
        .catch(() => resolve(""));
    });
  });
}
