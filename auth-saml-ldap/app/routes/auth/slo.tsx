import type { ActionArgs } from "@remix-run/node";

import { logout } from "~/session.server";

/* can't do idp initiated logout w/ cookie sessions, but can still use
   this point to logout if we wanna
*/
export const action = async ({ request }: ActionArgs) => {
  return await logout(request);
};
