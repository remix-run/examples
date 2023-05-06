import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import * as React from "react";

import { gdprConsent } from "~/cookies";

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await gdprConsent.parse(cookieHeader)) || {};
  return json({ track: cookie.gdprConsent });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { track } = useLoaderData<typeof loader>();
  const analyticsFetcher = useFetcher();
  React.useEffect(() => {
    if (track) {
      const script = document.createElement("script");
      script.src = "/dummy-analytics-script.js";
      document.body.append(script);
    }
  }, [track]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
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
        <LiveReload />
      </body>
    </html>
  );
}
