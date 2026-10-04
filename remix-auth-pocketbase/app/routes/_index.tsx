import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPocketbase, getUser } from "~/pb.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const pb = getPocketbase(request);
  const user = getUser(pb);

  return json({ user });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {data.user ? (
        <Link to="/logout">Logout</Link>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </>
      )}
    </div>
  );
}
