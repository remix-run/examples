import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ClientResponseError } from "pocketbase";

import { createSession, getPocketbase, getUser } from "~/pb.server";

interface LoginRequestData {
  email: string;
  password: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const pb = getPocketbase(request);

  const result = (await request.formData()) as unknown as Iterable<
    [LoginRequestData, FormDataEntryValue]
  >;
  const data: LoginRequestData = Object.fromEntries(result);

  try {
    await pb.collection("users").authWithPassword(data.email, data.password);

    if (!pb.authStore.model?.verified) {
      pb.authStore.clear();

      return json({ error: true, message: "Please verify your account" });
    }
  } catch (error) {
    if (error instanceof ClientResponseError) {
      return json({ error: true, message: error.message });
    }
  }

  if (!pb?.authStore?.isValid) {
    return json({ error: true, message: "invalid authstore" });
  }

  return createSession("/admin", pb);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const pb = getPocketbase(request);
  const user = getUser(pb);

  const redirectUrl = "/admin";

  if (user) return createSession(redirectUrl, pb);

  return json({ redirectUrl, user });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      {actionData?.error ? <div>{actionData.message}</div> : null}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue="pocketbase@remix.example"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          defaultValue="Passw0rd"
        />
      </div>

      <button>Log In</button>
    </Form>
  );
}
