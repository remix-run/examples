import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";

import { useEventSource } from "~/use-event-source";
import { useRevalidator } from "~/use-revalidator";

import styles from "./styles.processed.css";
import icons from "./icons.svg";

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
  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
  }, [data, revalidator]);
}

// FIXME: Pointless action for revalidation until:
// https://github.com/remix-run/remix/issues/4485
export function action() {
  return { ok: true };
}
