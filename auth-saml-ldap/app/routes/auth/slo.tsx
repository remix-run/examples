import { logout } from "~/session.server";

/* can't do idp initiated logout w/ cookie sessions, but can still use
   this point to logout if we wanna
*/
export const action = async (request: Request) => {
  return logout(request);
};
