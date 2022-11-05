import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { LightTheme, BaseProvider } from "baseui";
import { DebugEngine, Provider as StyletronProvider } from "styletron-react";
import { styletron } from "./styletron";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

const debug = process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
          <BaseProvider theme={LightTheme}>
            <Outlet />
          </BaseProvider>
        </StyletronProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
