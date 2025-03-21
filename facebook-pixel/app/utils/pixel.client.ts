/**
 * Budi K
 */
declare global {
  interface Window {
    fbq: (
      option: string,
      event: string,
      options?: Record<string, unknown>,
    ) => void
  }
}

export const init = (pixelId: string) => {
  if (!window.fbq) {
    console.warn(
      "window.fbq is not defined. This could mean your facebook pixel script has not loaded on the page yet.",
    );
    return;
  }
  console.log('initing pixel...');
  window.fbq("init", pixelId);
}

export const pageView = () => {
  if (!window.fbq) {
    console.warn(
      "window.fbq is not defined. This could mean your facebook pixel script has not loaded on the page yet.",
    );
    return;
  }
  console.log('firing pixel pageview...');
  window.fbq("track", "PageView");
}

export const track = (event: string, options?: Record<string, unknown>) => {
  if (!window.fbq) {
    console.warn(
      "window.fbq is not defined. This could mean your facebook pixel script has not loaded on the page yet.",
    );
    return;
  }
  window.fbq("track", event, options);
}

export const trackCustom = (event: string, options?: Record<string, unknown>) => {
  if (!window.fbq) {
    console.warn(
      "window.fbq is not defined. This could mean your facebook pixel script has not loaded on the page yet.",
    );
    return;
  }
  window.fbq("trackCustom", event, options);
}