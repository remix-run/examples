import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (user) {
    return redirect("dashboard");
  }
  return redirect("sign-in");
};
