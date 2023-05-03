import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import { useCallback, useState } from "react";

import * as firebaseRest from "~/firebase-rest";
import {
  checkSessionCookie,
  signIn,
  signInWithToken,
} from "~/server/auth.server";
import { commitSession, getSession } from "~/sessions";
import { getRestConfig } from "~/server/firebase.server";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  const headers = {
    "Set-Cookie": await commitSession(session),
  };
  if (uid) {
    return redirect("/", { headers });
  }
  const { apiKey, domain } = getRestConfig();
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/auth/google`;
  return json(
    {
      apiKey,
      domain,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      redirectUri,
    },
    { headers }
  );
};

type ActionData = {
  error?: string;
};
export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const idToken = form.get("idToken");
  let sessionCookie;
  try {
    if (typeof idToken === "string") {
      sessionCookie = await signInWithToken(idToken);
    } else {
      const email = form.get("email");
      const password = form.get("password");
      const formError = json(
        { error: "Please fill all fields!" },
        { status: 400 }
      );
      if (typeof email !== "string") return formError;
      if (typeof password !== "string") return formError;
      sessionCookie = await signIn(email, password);
    }
    const session = await getSession(request.headers.get("cookie"));
    session.set("session", sessionCookie);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error(error);
    return json({ error: String(error) }, { status: 401 });
  }
};

export default function Login() {
  const [clientAction, setClientAction] = useState<ActionData>();
  const actionData = useActionData<typeof action>();
  const restConfig = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const { GOOGLE_CLIENT_ID, redirectUri } = restConfig;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // To avoid rate limiting, we sign in client side if we can.
      const login = await firebaseRest.signInWithPassword(
        {
          email: event.currentTarget.email.value,
          password: event.currentTarget.password.value,
          returnSecureToken: true,
        },
        restConfig
      );
      if (firebaseRest.isError(login)) {
        setClientAction({ error: login.error.message });
        return;
      }
      submit({ idToken: login.idToken }, { method: "post" });
    },
    [submit, restConfig]
  );
  return (
    <div>
      <h1>Login</h1>
      {(clientAction?.error || actionData?.error) && (
        <p>{clientAction?.error || actionData?.error}</p>
      )}
      <form method="post" onSubmit={handleSubmit}>
        <input
          style={{ display: "block" }}
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        <input
          style={{ display: "block" }}
          name="password"
          placeholder="password"
          type="password"
        />
        <button style={{ display: "block" }} type="submit">
          Login
        </button>
      </form>
      <p>
        <a
          href={`https://accounts.google.com/o/oauth2/v2/auth\
?response_type=code\
&client_id=${GOOGLE_CLIENT_ID}\
&redirect_uri=${redirectUri}\
&scope=openid%20email%20profile`}
        >
          Login with Google
        </a>
      </p>
      <p>
        Do you want to <Link to="/join">join</Link>?
      </p>
    </div>
  );
}
