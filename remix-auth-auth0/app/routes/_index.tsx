import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { auth, getSession } from "~/utils/auth.server";

type LoaderError = { message: string } | null;
export const loader = async ({ request }: LoaderArgs) => {
  await auth.isAuthenticated(request, { successRedirect: "/private" });
  const session = await getSession(request.headers.get("Cookie"));
  const error = session.get(auth.sessionErrorKey) as LoaderError;
  return json({ error });
};

export default function Screen() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <Form method="post" action="/auth0">
      {error ? <div>{error.message}</div> : null}
      <button>Sign In with Auth0</button>
    </Form>
  );
}
