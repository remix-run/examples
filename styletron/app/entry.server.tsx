import type { EntryContext } from "@remix-run/node";
import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";

import { collectStyles } from "./styletron";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  // Add server-rendered styles
  markup = markup.replace("__STYLES__", collectStyles());

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
