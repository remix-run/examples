import { Link } from "@remix-run/react";

import { Box } from "~/components/Box";

export default function Index() {
  return (
    <Box>
      <h1>Welcome to Remix With Styled Components</h1>
      <ul>
        <li>
          <Link to="/error">Error</Link>
        </li>
        <li>
          <Link to="/404">404</Link>
        </li>
      </ul>
    </Box>
  );
}
