import { injectStyles, createStylesServer } from "@mantine/remix";
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

const server = createStylesServer();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );
  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
