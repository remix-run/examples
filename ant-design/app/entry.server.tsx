import { extractStyle, StyleProvider, createCache } from "@ant-design/cssinjs";
import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";


export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {

  const cache = createCache();
  let markup = renderToString(
    <StyleProvider cache={cache}>
      <RemixServer
        context={remixContext}
        url={request.url}
      />
    </StyleProvider>
  )
  
  markup = markup.replace("__ANTD__STYLES__", extractStyle(cache));

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
