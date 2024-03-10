import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <>
      <pre>/</pre>
      <h1>Welcome</h1>
      <Link to="/login">Login</Link>
    </>
  )
}