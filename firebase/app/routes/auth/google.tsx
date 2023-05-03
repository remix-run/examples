import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { signInWithIdp } from "~/server/auth.server";
import { commitSession, getSession } from "~/sessions";

export const loader = async ({ request }: LoaderArgs) => {
  // https://developers.google.com/identity/protocols/oauth2/openid-connect
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/auth/google`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const token = await response.json();
  const sessionCookie = await signInWithIdp(token.id_token, "google.com");
  const session = await getSession(request.headers.get("cookie"));
  session.set("session", sessionCookie);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
