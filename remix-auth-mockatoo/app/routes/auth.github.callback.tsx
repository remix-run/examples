import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { authenticator, sessionStorage } from "~/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  try {
    session.set("user", await authenticator.authenticate("github", request));
  } catch (error) {
    if (error instanceof Response) throw error;
    session.flash(
      "error",
      error instanceof Error ? error.message : "Sign-in failed",
    );
  }
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
};
