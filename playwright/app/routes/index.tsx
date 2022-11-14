import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <h1>Welcome to Remix + Playwright example</h1>
      <Link to="/login">Login</Link>
    </main>
  );
}
