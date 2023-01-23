import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import type { LoaderArgs } from "@remix-run/server-runtime";

import { verifyLogin } from "~/ldap.server";
import {
  getSession,
  sessionStorage,
  getUserId,
  createUserSession,
} from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");

  const session = await getSession(request);
  const loginError = session.get("loginError") || null;

  return json(
    { loginError },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const errors = {};

  if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }
  if (typeof password !== "string" || password.length === 0) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length) {
    return json({ errors: errors }, { status: 400 });
  }
  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request: request,
    userId: user.id,
    expiration: undefined,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function Login() {
  const { loginError } = useLoaderData();

  const actionData = useActionData<typeof action>();

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="hero ">
      <div className="hero-body">
        <div className="columns is-centered mt-5">
          <div className="column is-4 mt-5 box">
            <Form method="post" className="form">
              <h1 className="title is-1">Login</h1>
              {loginError ? (
                <article className="message is-danger ">
                  <div className="message-body p-2 is-flex">
                    <span>{loginError}</span>
                  </div>
                </article>
              ) : null}
              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                  <input
                    ref={emailRef}
                    className="input"
                    name="email"
                    autoComplete="off"
                  />
                </div>
                {actionData?.errors?.email && (
                  <p className="help is-danger">{actionData.errors.email}</p>
                )}
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left">
                  <input
                    ref={passwordRef}
                    className="input"
                    type="password"
                    name="password"
                  />
                </div>
                {actionData?.errors?.password && (
                  <p className="help is-danger">{actionData.errors.password}</p>
                )}
              </div>
              <button
                className="button is-info is-fullwidth"
                type="submit"
                value="Submit"
              >
                Log In
              </button>
            </Form>

            <Link className="button is-fullwidth" to="/">
              Login with SAML
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
