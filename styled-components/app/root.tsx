import type { MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { Box } from "~/components/Box";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <Box>
              <h1>Catch Boundary</h1>
              <p>
                {error.status} {error.statusText}
              </p>
            </Box>
          );
    }

    let errorMessage = "Unknown error";
    let errorStatus = 500;
    if (error instanceof Error) {
        errorMessage = error.message;
    }

  return (
    <Box>
        <h1>Error Boundary</h1>
        <p>
            {errorStatus} {errorMessage}
        </p>
    </Box>
  );
}
