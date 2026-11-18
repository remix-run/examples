import type { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/auth.server";

// Redirects to GitHub (or Mockatoo, outside production) to sign in.
export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.authenticate("github", request);
};
