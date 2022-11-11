import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import primetheme from "primereact/resources/themes/lara-light-indigo/theme.css";
import primecore from "primereact/resources/primereact.min.css";
import primeicons from "primeicons/primeicons.css";
import primeflex from "primeflex/primeflex.min.css";
export function links() {
   return [
     {
       rel: "stylesheet",
       href: primeflex,
     },
     {
       rel: "stylesheet",
       href: primetheme,
     },
     {
       rel: "stylesheet",
       href: primecore,
     },
     {
       rel: "stylesheet",
       href: primeicons,
     },
   ];
 }

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
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
        <LiveReload />
      </body>
    </html>
  );
}
