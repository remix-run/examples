import type { AnalyticsSnippet } from "@segment/analytics-next";

declare global {
  interface Window {
    analytics: AnalyticsSnippet;
  }
}

const notDefinedMessage =
  "window.analytics is not defined. The Segment script may not have loaded on the page yet.";

/**
 * @example
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#page
 */
export const page = (...params: Parameters<AnalyticsSnippet["page"]>) => {
  if (!window.analytics) {
    console.warn(notDefinedMessage);
    return;
  }
  window.analytics.page(...params);
};

/**
 * @example
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#trackForm
 */
export const track = (...params: Parameters<AnalyticsSnippet["track"]>) => {
  if (!window.analytics) {
    console.warn(notDefinedMessage);
    return;
  }
  window.analytics.track(...params);
};
