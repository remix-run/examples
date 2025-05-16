import { PassThrough, Transform } from "stream";

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { isbot } from "isbot";

// Reject/cancel all pending promises after 5 seconds
export const streamTimeout = 15000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  const styleSheet = new ServerStyleSheet();
  const decoder = new TextDecoder("utf-8");
  // Stream interceptor in order to inject additional HTML on the fly
  const transformer = transformStream({ decoder, styleSheet });

  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let didError = false;

    const { pipe, abort } = renderToPipeableStream(
      <StyleSheetManager sheet={styleSheet.instance}>
        <RemixServer context={remixContext} url={request.url} />
      </StyleSheetManager>,
      {
        [callbackName]: () => {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");

          pipe(transformer);
          transformer.pipe(body);

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
        },
        onShellError: (err: unknown) => {
          reject(err);
        },
        onError: () => {
          didError = true;
        },
      }
    );

    // Automatically timeout the React renderer after 6 seconds, which ensures
    // React has enough time to flush down the rejected boundary contents
    setTimeout(abort, streamTimeout + 1000);
  });
}

/**
 * Returns a Transform stream that injects styled-components styles into streamed HTML.
 * - Replaces `__STYLES__` with styled-components CSS.
 */
const transformStream = ({
  decoder,
  styleSheet,
}: {
  decoder: TextDecoder;
  styleSheet: ServerStyleSheet;
}) =>
  new Transform({
    objectMode: true,
    flush(callback) {
      callback();
    },
    transform(chunk, encoding, callback) {
      let renderedHtml =
        chunk instanceof Uint8Array
          ? decoder.decode(chunk, { stream: true })
          : chunk.toString(encoding || "utf8");
      renderedHtml = renderedHtml.replace(
        "__STYLES__",
        styleSheet.getStyleTags()
      );
      this.push(renderedHtml);

      callback();
    },
  });
