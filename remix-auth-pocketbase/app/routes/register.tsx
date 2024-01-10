import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { ClientResponseError } from "pocketbase";

import { createSession, getPocketbase, getUser } from "~/pb.server";

interface RegisterRequestData {
  email: string;
  password: string;
  passwordConfirm: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const pb = getPocketbase(request);

  const result = (await request.formData()) as unknown as Iterable<
    [RegisterRequestData, FormDataEntryValue]
  >;
  const data: RegisterRequestData = Object.fromEntries(result);

  if (data.password !== data.passwordConfirm)
    return json({
      success: false,
      error: true,
      message: "Passwords do not match",
    });
  if (data.password.length < 8)
    return json({
      success: false,
      error: true,
      message: "Password needs to be 8 characters or longer",
    });

  try {
    await pb.collection("users").create(data);
    await pb.collection("users").requestVerification(data.email);
  } catch (error) {
    if (error instanceof ClientResponseError) {
      return json({ success: false, error: true, message: error.message });
    }
  }

  return json({
    error: false,
    success: true,
    message:
      "Please check your email inbox and click the link to verify your account",
  });
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
          defaultValue="2+pocketbase@remix.example"
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

      <div>
        <label htmlFor="passwordConfirm">Password Confirm</label>
        <input
          type="password"
          name="passwordConfirm"
          id="passwordConfirm"
          defaultValue="Passw0rd"
        />
      </div>

      <button>Register</button>

      <Link to="/login">Login</Link>
    </Form>
  );
}
