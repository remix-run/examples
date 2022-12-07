import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { auth } from "~/auth.server";

export const action = async ({ request }: ActionArgs) => {
  await auth.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const { profile } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return json({ profile });
};

export default function Screen() {
  const { profile } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="post">
        <button>Log Out</button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </>
  );
}
