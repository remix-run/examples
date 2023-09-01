import { Link } from "@remix-run/react";

export default function Screen() {
  return (
    <>
      <h1>On-Demand Hydration</h1>
      <ul>
        <li>
          <Link to="with-js">A route that always load JS</Link>
        </li>
        <li>
          <Link to="without-js">A route that never loads JS</Link>
        </li>
        <li>
          <Link to="on-demand-js">
            A route that loads JS based on the loader data
          </Link>
        </li>
      </ul>
    </>
  );
}
