import { Outlet, useCatch } from "@remix-run/react";

import { Box } from "~/components/Box";

export default function Boundary() {
  return <Outlet />;
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Box>
      <h1>Catch Boundary</h1>
      <p>
        {caught.status} {caught.statusText}
      </p>
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Box>
      <h1>Error Boundary</h1>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </Box>
  );
}
