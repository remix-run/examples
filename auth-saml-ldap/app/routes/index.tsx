import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authorize } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  return authorize(request, undefined, async ({ user, session }) => {
    // here we can get the data for this route and return it

    return user;
  });
}

export default function Index() {
  const user = useLoaderData<typeof loader>();
  return <div> hi {user.email}</div>;
}
