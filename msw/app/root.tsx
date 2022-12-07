import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export const loader = async () => {
  const data = await fetch("https://my-mock-api.com").then((response) =>
    response.json()
  );

  if (!data || typeof data.message !== "string") {
    throw json({ message: "Server error" }, { status: 500 });
  }

  return json(data);
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>{data.message}</h1>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
