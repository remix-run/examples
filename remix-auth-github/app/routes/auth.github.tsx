import type { ActionArgs } from "@remix-run/node";

import { auth } from "~/auth.server";

export const action = async ({ request }: ActionArgs) => {
  return await auth.authenticate("github", request, {
    successRedirect: "/private",
    failureRedirect: "/",
  });
};
