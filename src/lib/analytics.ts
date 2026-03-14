/**
 * Analytics and conversion tracking.
 * Pushes events to GTM dataLayer for use in Google Tag Manager.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type AnalyticsEventName =
  | "form_submit"
  | "form_goal"
  | "cta_click"
  | "newsletter_signup"
  | "contact_submit"
  | "lead_magnet_download"
  | "page_view";

export interface TrackEventParams {
  event: AnalyticsEventName | string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  [key: string]: unknown;
}

/**
 * Push a custom event to the dataLayer for GTM.
 * Use in GTM: Trigger = Custom Event, Event name = params.event (e.g. "form_goal").
 */
export function trackEvent(params: TrackEventParams): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push(params);
}

/**
 * Track a form conversion (e.g. contact form, newsletter).
 * Configure a GTM conversion/goal for event name "form_goal" and form_id.
 */
export function trackFormGoal(formId: string, optionalParams?: Record<string, unknown>): void {
  trackEvent({
    event: "form_goal",
    eventCategory: "form",
    eventAction: "submit",
    eventLabel: formId,
    form_id: formId,
    ...optionalParams,
  });
}

/**
 * Track CTA button/link click for conversion funnel analysis.
 */
export function trackCtaClick(ctaName: string, destination?: string): void {
  trackEvent({
    event: "cta_click",
    eventCategory: "cta",
    eventAction: "click",
    eventLabel: ctaName,
    cta_name: ctaName,
    destination: destination ?? typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}
