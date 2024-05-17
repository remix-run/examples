import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "@mantine/core";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useState } from "react";
import { hydrateRoot } from "react-dom/client";

import { ClientStyleContext } from "./clientStyleContext";

function ClientStyleProvider({ children }: { children: React.ReactNode }) {
  const createCache = () => createEmotionCache({ key: "css" });
  const [cache, setCache] = useState(createCache());
  const reset = () => setCache(createCache());

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientStyleProvider>
        <RemixBrowser />
      </ClientStyleProvider>
    </StrictMode>,
  );
});
