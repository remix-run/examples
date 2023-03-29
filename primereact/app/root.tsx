import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import lightTheme from 'primereact/resources/themes/lara-light-indigo/theme.css'; //Light Theme
import darkTheme from 'primereact/resources/themes/lara-dark-indigo/theme.css'; //Dark Theme
import primecore from 'primereact/resources/primereact.min.css'; //Core
import primeicons from 'primeicons/primeicons.css'; //Icons
import primeflex from 'primeflex/primeflex.min.css'; //Primeflex
export function links() {
  return [
    {
      rel: 'stylesheet',
      href: primeflex,
    },
    {
      rel: 'stylesheet',
      href: lightTheme,
    },
    {
      rel: 'stylesheet',
      href: darkTheme,
      media: '(prefers-color-scheme: dark)',
    },
    {
      rel: 'stylesheet',
      href: primecore,
    },
    {
      rel: 'stylesheet',
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
