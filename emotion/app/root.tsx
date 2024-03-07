import { withEmotionCache } from "@emotion/react";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { useContext, useEffect, useRef } from "react";

import ClientStyleContext from "~/styles/client.context";
import ServerStyleContext from "~/styles/server.context";


export const meta: MetaFunction = () => {
  return [
    { name: "title", content: "Remix with Emotion" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { name: "charset", content: "utf-8" },
  ]
}

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);
    const reinjectStylesRef = useRef(true);

    // Only executed on client
    // When a top level ErrorBoundary or CatchBoundary are rendered,
    // the document head gets removed, so we have to create the style tags
    useEffect(() => {
      if (!reinjectStylesRef.current) {
        return;
      }
      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // ensure we only do this once per mount
      reinjectStylesRef.current = false;
    }, [clientStyleData, emotionCache.sheet]);

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  },
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  );
}