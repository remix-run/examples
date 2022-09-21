import { RemixBrowser } from "@remix-run/react";
import { PropsWithChildren, useState } from "react";
import { CacheProvider } from "@emotion/react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { hydrateRoot } from "react-dom/client";
import theme from "./src/theme";
import createEmotionCache from "./src/createEmotionCache";
import ClientStyleContext from "./src/ClientStyleContext";

function ClientCacheProvider({ children }: PropsWithChildren) {
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

hydrateRoot(
  document,
  <ClientCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RemixBrowser />
    </ThemeProvider>
  </ClientCacheProvider>,
);
