import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css?url";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  // if you already have one only add this stylesheet to your list of links
  { rel: "stylesheet", href: nProgressStyles },
];

export const meta: MetaFunction = () => [{ title: "New Remix App" }];

export function Layout({ children }: { children: React.ReactNode }) {
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (navigation.state === "idle") NProgress.done();
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else NProgress.start();
  }, [navigation.state]);

  return <Outlet />;
}
