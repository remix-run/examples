import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser, getSession, sessionStorage } from "./session.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);

  return json({
    headers: {
      // only necessary with cookieSessionStorage
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
    user: await getUser(request),
  });
}

export default function App() {
  // example of accessing user in root.tsx.
  const { user } = useLoaderData(); // eslint-disable-line

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
