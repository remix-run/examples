import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { logout } from "~/session.server";
import { redirect } from "@remix-run/node";

/* can't do idp initiated logout w/ cookie sessions, but can still use
   this point to logout if we wanna
*/
export const action: ActionFunction = async ({ request }) => {
  return await logout(request);
};
