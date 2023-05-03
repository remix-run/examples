/** @jsx jsx */
import { Link } from "@remix-run/react";
import { jsx } from "@theme-ui/core";

export default function Jokes() {
  return (
    <div sx={{ backgroundColor: "primary" }}>
      <h1>Jokes</h1>
      <p>This route works fine.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
