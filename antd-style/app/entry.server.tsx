import { extractStaticStyle, StyleProvider } from "antd-style";
import { createCache } from '@ant-design/cssinjs';
import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";


export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {

  const antdCache = createCache();

  let html = renderToString(
    <StyleProvider cache={antdCache}>
      <RemixServer
        context={remixContext}
        url={request.url}
      />
    </StyleProvider>
  )

  const styles = extractStaticStyle(html, { antdCache })
    .map((item) => item.tag);

  html = html.replace("__ANTD__STYLES__", styles.join("\n"));

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${html}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
