import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { authenticator, supabaseStrategy } from "~/auth.server";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/login",
  });

  return json({ email: session.user?.email });
};

export default function Screen() {
  const { email } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Hello {email}</h1>

      <Form method="post">
        <button>Log Out</button>
      </Form>
    </>
  );
}
