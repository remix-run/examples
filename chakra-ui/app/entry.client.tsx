import createEmotionCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useCallback, useState } from "react";
import { hydrate } from "react-dom";
import { ClientStyleContext } from "./clientContext";

function ClientCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState(createEmotionCache({ key: "css" }));

  const reset = useCallback(() => {
    return setCache(createEmotionCache({ key: "css" }));
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

const hydration = () => {
  const emotionCache = createEmotionCache({ key: "css" });

  startTransition(() => {
    /* 
      why `hydrate`? When using `HydrateRoot`, the deferred data, that is fast, will flash on the screen to the fallback during hydration.
      I've fixed flashing fast deferred data this by using `hydrate` instead and it works.
      If you don't defer any data you may use `HydrateRoot` instead, since it's newer.

      You can change to `HydrateRoot`, to see the flash of "medium data" on index page.
      The flash will be more noticable, when the app grows, and hydration takes longer.

      hydrateRoot(
        document,
        <StrictMode>
          <ClientCacheProvider>
            <RemixBrowser />
          </ClientCacheProvider>
        </StrictMode>,
      );
    */
    hydrate(
      <StrictMode>
        <ClientCacheProvider>
          <RemixBrowser />
        </ClientCacheProvider>
      </StrictMode>,
      document,
    );
  });
};

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydration);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydration, 1);
}
