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
import { useEventSource } from "remix-utils";

import icons from "./icons.svg";
import styles from "./styles.processed.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Fake Linear Demo",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preload", href: icons, as: "image", fetchpriority: "high" },
];

export default function App() {
  useRealtimeIssuesRevalidation();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function useRealtimeIssuesRevalidation() {
  const data = useEventSource("/issues-events");
  const { revalidate } = useRevalidator();
  useEffect(() => {
    revalidate();
  }, [data, revalidate]);
}
