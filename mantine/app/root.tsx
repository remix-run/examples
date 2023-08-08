import type { ColorScheme } from "@mantine/core";
import {
  Box,
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
  Title,
  useEmotionCache,
} from "@mantine/core";
import { useIsomorphicEffect } from "@mantine/hooks";
import { StylesPlaceholder } from "@mantine/remix";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { useContext, useRef, useState } from "react";

import { ClientStyleContext } from "./clientStyleContext";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

createEmotionCache({ key: "mantine" });

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Box p="lg">
        <Title color="red">
          [CatchBoundary]: {caught.status} {caught.statusText}
        </Title>
      </Box>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Box p="lg">
        <Title color="red">
          [ErrorBoundary]: There was an error: {error.message}
        </Title>
      </Box>
    </Document>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const clientStyleData = useContext(ClientStyleContext);
  const cache = useEmotionCache();
  const reinjectStylesRef = useRef(true);

  // Only executed on client
  // When a top level ErrorBoundary or CatchBoundary are rendered,
  // the document head gets removed, so we have to create the style tags
  useIsomorphicEffect(() => {
    if (!reinjectStylesRef.current) {
      return;
    }

    // re-link sheet container
    cache.sheet.container = document.head;

    // re-inject tags
    const tags = cache.sheet.tags;
    cache.sheet.flush();
    tags.forEach((tag) => {
      (cache.sheet as any)._insertTag(tag);
    });

    // reset cache to re-apply global styles
    clientStyleData?.reset();

    // ensure we only do this once per mount
    reinjectStylesRef.current = false;
  }, []);

  return (
    <html lang="en">
      <head>
        <StylesPlaceholder />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        <MantineTheme>{children}</MantineTheme>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MantineTheme({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withNormalizeCSS
        withGlobalStyles
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
