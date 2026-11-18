import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { sessionStorage } from "~/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const user = session.get("user") ?? null;
  const error = session.get("error") ?? null;
  return json(
    { user, error },
    // Reading the flashed error removes it from the session.
    { headers: { "Set-Cookie": await sessionStorage.commitSession(session) } },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};

export default function Index() {
  const { user, error } = useLoaderData<typeof loader>();

  if (!user) {
    return (
      <Form method="post" action="/auth/github">
        {error ? <p role="alert">{error}</p> : null}
        <button>Sign in with GitHub</button>
      </Form>
    );
  }

  return (
    <>
      <p>
        Signed in as <strong>{user.login}</strong>
      </p>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <Form method="post">
        <button>Sign out</button>
      </Form>
    </>
  );
}
