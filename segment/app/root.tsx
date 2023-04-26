import { type MetaFunction, json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useEffect } from "react";

import * as segment from "~/utils/segment.client";

export const loader = async () => {
  return json({ segmentWriteKey: process.env.SEGMENT_WRITE_KEY });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App + Segment",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const location = useLocation();
  const { segmentWriteKey } = useLoaderData<typeof loader>();

  useEffect(() => {
    segment.page();
  }, [location]);

  const loadSegmentSnippet = Boolean(
    process.env.NODE_ENV !== "development" && segmentWriteKey
  );

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {loadSegmentSnippet ? (
          <script
            id="segment-script"
            dangerouslySetInnerHTML={{
              __html: `
                !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${segmentWriteKey}";analytics.SNIPPET_VERSION="4.15.2";
                analytics.load("${segmentWriteKey}");
                analytics.page();
                }}();
              `,
            }}
          />
        ) : null}

        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </header>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
