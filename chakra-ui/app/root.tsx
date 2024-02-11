import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { withEmotionCache } from "@emotion/react";
import React, { useContext, useEffect } from "react";
import { ClientStyleContext, ServerStyleContext } from "~/emotion/context";
import {
  Box,
  Center,
  ChakraProvider,
  Code,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { LinksFunction } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),

  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

const Document = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title></title>
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ChakraProvider>{children}</ChakraProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  // throw new Error("💣💥 Booooom");

  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let errorView: React.ReactNode;

  if (isRouteErrorResponse(error)) {
    errorView = (
      <>
        <Heading fontSize={"x-large"}>
          Something bad happened during connection
        </Heading>
        <Flex
          flexDirection={"column"}
          alignItems={"start"}
          width={"70vw"}
          gap={"1vh"}
        >
          <Code color={"red"}>
            {error.status} {error.statusText}
          </Code>
          <Code color={"red"}>{error.data}</Code>
        </Flex>
      </>
    );
  } else if (error instanceof Error) {
    errorView = (
      <>
        <Heading fontSize={"x-large"}>
          Something bad happened during runtime
        </Heading>
        <Flex
          flexDirection={"column"}
          alignItems={"start"}
          width={"70vw"}
          gap={"1vh"}
        >
          <Code color={"red"}>{error.message}</Code>
          <Box>
            <Text>Stack trace:</Text>
            <Code color={"red"}>{error.stack}</Code>
          </Box>
        </Flex>
      </>
    );
  } else {
    errorView = (
      <>
        <Heading fontSize={"x-large"}>Something bad happened</Heading>
        <Text>But we don't know what it is 😢</Text>
      </>
    );
  }

  return (
    <Document>
      <Center h={"100vh"}>
        <Flex flexDirection={"column"} alignItems={"center"} gap={"2vh"}>
          {errorView}
        </Flex>
      </Center>
    </Document>
  );
}
