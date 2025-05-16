import { isRouteErrorResponse, Outlet, useRouteError } from "@remix-run/react";
import { Box } from "~/components/Box";

export default function Boundary() {
  return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <Box>
              <h1>Catch Boundary</h1>
              <p>
                {error.status} {error.statusText}
              </p>
            </Box>
          );
    }

    let message, stack;
    if (error instanceof Error) {
        message = error.message;
        stack = error.stack;
    }

  return (
    <Box>
      <h1>Error Boundary</h1>
      <p>{message}</p>
      <pre>{stack}</pre>
    </Box>
  );
}