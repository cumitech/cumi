/**
 * Server-side reCAPTCHA Enterprise verification.
 * Calls Google's create assessment API and returns success/score.
 */
const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID || "goldmantrustgroupinc";
const RECAPTCHA_API_KEY = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export interface VerifyRecaptchaResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
}

export async function verifyRecaptchaEnterprise(
  token: string,
  expectedAction?: string
): Promise<VerifyRecaptchaResult> {
  if (!RECAPTCHA_API_KEY) {
    return { success: true };
  }
  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${RECAPTCHA_API_KEY}`;
  const body: { event: { token: string; siteKey?: string; expectedAction?: string } } = {
    event: {
      token,
      siteKey: SITE_KEY || undefined,
      ...(expectedAction ? { expectedAction } : {}),
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || "Verification request failed",
      };
    }

    const tokenProperties = data.tokenProperties;
    const riskAnalysis = data.riskAnalysis;

    const success =
      tokenProperties?.valid === true &&
      (expectedAction ? tokenProperties?.action === expectedAction : true);

    return {
      success: !!success,
      score: typeof riskAnalysis?.score === "number" ? riskAnalysis.score : undefined,
      action: tokenProperties?.action,
      ...(tokenProperties?.invalidReason ? { error: tokenProperties.invalidReason } : {}),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Verification failed",
    };
  }
}
