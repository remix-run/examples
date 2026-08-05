import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { ClientResponseError } from "pocketbase";

import { createSession, getPocketbase, getUser } from "~/pb.server";

interface ForgotPasswordRequestData {
  email: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const pb = getPocketbase(request);

  const result = (await request.formData()) as unknown as Iterable<
    [ForgotPasswordRequestData, FormDataEntryValue]
  >;
  const data: ForgotPasswordRequestData = Object.fromEntries(result);

  try {
    await pb.collection("users").requestPasswordReset(data.email);

    return json({
      success: true,
      error: false,
      message: "An email has been sent to reset your password!",
    });
  } catch (error) {
    if (error instanceof ClientResponseError) {
      return json({ success: false, error: true, message: error.message });
    }
  }
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
      {actionData?.success ? (
        <div style={{ color: "green" }}>{actionData.message}</div>
      ) : null}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          defaultValue="pocketbase@remix.example"
        />
      </div>

      <button>Forgot Password</button>

      <Link to="/login">Login</Link>
    </Form>
  );
}
