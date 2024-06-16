import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useFetcher,
  useRouteLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";

import { gdprConsent } from "~/cookies.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await gdprConsent.parse(cookieHeader)) || {};

  return json({ track: cookie.gdprConsent });
};

export function Layout({ children }: { children: React.ReactNode }) {
  // We use `useRouteLoaderData` here instead of `useLoaderData` because
  // the <Layout /> component will also be used by the <ErrorBoundary />
  // if an error is thrown somewhere in the app, and we can't call
  // `useLoaderData()` while rendering an <ErrorBoundary />.
  const rootLoaderData = useRouteLoaderData<{ track?: true }>("root");
  const track = rootLoaderData?.track ?? false;

  useEffect(() => {
    if (track) {
      const script = document.createElement("script");
      script.src = "/dummy-analytics-script.js";
      document.body.append(script);
    }
  }, [track]);

  const analyticsFetcher = useFetcher();

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
        {track ? null : (
          <div
            style={{
              backgroundColor: "#ccc",
              padding: 10,
              position: "fixed",
              bottom: 0,
            }}
          >
            <analyticsFetcher.Form method="post" action="/enable-analytics">
              We use Cookies...
              <button name="accept-gdpr" value="true" type="submit">
                Accept
              </button>
            </analyticsFetcher.Form>
          </div>
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
