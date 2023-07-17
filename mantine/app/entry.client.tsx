import { ClientProvider } from "@mantine/remix";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientProvider>
        <RemixBrowser />
      </ClientProvider>
    </StrictMode>,
  );
});
