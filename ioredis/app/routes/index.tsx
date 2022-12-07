import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { redis } from "~/utils/redis.server";

export const loader = async () => {
  const message = await redis.get("message");
  return json({ message });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message");

  if (!message || typeof message !== "string") {
    return json("String only!", { status: 400 });
  }

  await redis.set("message", message);

  return redirect("/");
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();
  const actionMessage = useActionData<typeof action>();

  return (
    <main>
      <div>
        <b>Stored Message:</b> {data.message}
      </div>
      <Form method="post">
        <h2>Change the message</h2>
        <label>
          <div>Message</div>
          <input name="message" defaultValue={data.message ?? ""} />
        </label>
        <div>
          <button type="submit">Save</button>
        </div>
      </Form>
      {actionMessage ? (
        <p>
          <b>{actionMessage}</b>
        </p>
      ) : null}
    </main>
  );
}
