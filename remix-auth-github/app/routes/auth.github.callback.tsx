import type { LoaderArgs } from "@remix-run/node";

import { auth } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  return auth.authenticate("github", request, {
    successRedirect: "/private",
    failureRedirect: "/",
  });
};
