import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import { useState } from "react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { ClientStyleContext } from "./styles/context";
import { createEmotionCache } from "./styles/createEmotionCache";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <ClientCacheProvider>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </ClientCacheProvider>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
