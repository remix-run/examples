import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { destroySession, getSession } from "~/sessions";

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export default function Logout() {
  return (
    <div>
      <h1>Logout</h1>
      <p>Press the button below to log out.</p>
      <Form method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
