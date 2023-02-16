import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// `startTransition` keeps React hydration from blocking the main thread, this
// is useful in a server-rendered app like Remix because the UI is already on
// the page the user could start scrolling. If you have a very large document
// hydration could take hundreds of milliseconds, and make the scroll janky.
// `startTransition` keeps the main thread from blocking so the user can scroll
// while React hydrates without jank.
startTransition(() => {
  // Notice that this is your own application code that calls `hydrateRoot`
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
