import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { getIdp, sp } from "~/saml.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export let authorize: Policy<{
  user: User;
  session: Session;
}> = async (request, groups = undefined, callback) => {
  let session = await getSession(request);
  const redirectTo: string = new URL(request.url).pathname;
  let user = await getUser(request);
  try {
    // send back to login page if the user doesn't exist.
    if (!user) {
      const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      throw redirect(`/?${searchParams}`);
    }

    // potentially check user for required groups here.
  } catch {
    // destroy session and try to login
    // try again, in case the saml server is broken. Will
    // redirect to /login to use ldap auth as a fallback.
    try {
      const idp = await getIdp();
      const { id, context } = sp.createLoginRequest(idp, "redirect");
      const url = new URL(request.url);
      const pathname = url.searchParams.get("redirectTo") || "/";
      return redirect(context + "&RelayState=" + pathname, {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(session),
        },
      });
    } catch {
      session.flash("loginError", `Could not authenticate you from SAML.`);

      throw redirect("/login", {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    }
  }
  return await callback({ user, session });
};

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  expiration,
  redirectTo,
}: {
  request: Request;
  userId: string;
  expiration: string;
  redirectTo: string;
}) {
  const expirationDate = expiration
    ? new Date(expiration)
    : new Date(new Date().getTime() + 60 * 60 * 24 * 7);
  const maxAge = expirationDate.getTime() - new Date().getTime();
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: maxAge,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
