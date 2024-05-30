import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRevalidator,
} from "@remix-run/react";
import { useEffect } from "react";
import { useEventSource } from "remix-utils/sse/react";

import icons from "~/icons.svg";
import styles from "~/styles.css?url";

export const meta: MetaFunction = () => [
  {
    title: "Remix Fake Linear Demo",
  },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preload", href: icons, as: "image", fetchpriority: "high" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useRealtimeIssuesRevalidation();
  return <Outlet />;
}

function useRealtimeIssuesRevalidation() {
  const data = useEventSource("/issues-events");
  const { revalidate } = useRevalidator();
  useEffect(() => {
    revalidate();
  }, [data, revalidate]);
}
