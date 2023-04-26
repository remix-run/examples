import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import type { V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { viewport: "width=device-width,initial-scale=1" },
];

function Document({
  children,
  title = "App title",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  // throw new Error("💣💥 Booooom");

  return (
    <Document>
      <ChakraProvider>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}

// How ChakraProvider should be used on ErrorBoundary
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Document title="Error!">
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="blue.500">
            {`${error}`}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}
