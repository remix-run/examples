import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { commitSession, getSession } from "~/sessions.server";

export const loader = async ({ request }: LoaderArgs) => {
  // Get the session from the cookie
  const session = await getSession(request.headers.get("Cookie"));
  const myStoredData = session.get("myStoredData");
  // If no session found (was never created or was expired) create a new session.
  if (!myStoredData) {
    session.set("myStoredData", "Some data");
    return json(
      { message: "Created new session" },
      { headers: { "Set-Cookie": await commitSession(session) } },
    );
  }
  // If session was found, present the session info.
  return json({
    message: `Showing Session info: ${myStoredData}`,
  });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  return <div>{data.message}</div>;
}
