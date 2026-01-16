import type { AnalyticsEvent, AnalyticsPayload } from "@/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  organizationId?: string,
  metadata?: Record<string, string>
): void {
  const payload: AnalyticsPayload = {
    event,
    organizationId,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", payload);
  }

  // Send to GA4 if available
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, {
      organization_id: organizationId,
      ...metadata,
    });
  }
}

export function trackDonationLinkClick(organizationId: string): void {
  trackEvent("donation_link_clicked", organizationId);
}

export function trackSupportConfirmed(organizationId: string): void {
  trackEvent("support_confirmed", organizationId);
}

export function trackOrganizationViewed(organizationId: string): void {
  trackEvent("organization_viewed", organizationId);
}

export function trackPageView(pagePath: string): void {
  trackEvent("page_view", undefined, { page_path: pagePath });
}
