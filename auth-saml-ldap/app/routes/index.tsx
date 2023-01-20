import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { authorize } from "~/session.server";
import type { LoaderArgs } from "@remix-run/server-runtime";

export async function loader({ request }: LoaderArgs) {
  return authorize(request, undefined, async ({ user, session }) => {
    // here we can get the data for this route and return it

    return user;
  });
}

export default function Index() {
  const user = useLoaderData();
  return (
    <div> hi {user.email}</div>
  );
}
