import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import {
  AUTH0_CLIENT_ID,
  AUTH0_LOGOUT_URL,
  AUTH0_RETURN_TO_URL,
} from "~/constants/index.server";
import { destroySession, getSession } from "~/utils/auth.server";

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const logoutURL = new URL(AUTH0_LOGOUT_URL);

  logoutURL.searchParams.set("client_id", AUTH0_CLIENT_ID);
  logoutURL.searchParams.set("returnTo", AUTH0_RETURN_TO_URL);

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
