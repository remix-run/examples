import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { authenticator, sessionStorage, supabaseStrategy } from "~/auth.server";
import { signInWithGithub } from "~/supabase.client";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.authenticate("sb", request, {
    successRedirect: "/private",
    failureRedirect: "/login",
  });
};

type LoaderError = { message: string } | null;
export const loader = async ({ request }: LoaderArgs) => {
  await supabaseStrategy.checkSession(request, {
    successRedirect: "/private",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const error = session.get(authenticator.sessionErrorKey) as LoaderError;

  return json({ error });
};

export default function Screen() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="post">
        {error && <div>{error.message}</div>}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>

        <button>Log In</button>
      </Form>
      <p>
        <button onClick={() => signInWithGithub()}>Sign in with Github</button>
      </p>
    </>
  );
}
