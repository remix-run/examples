import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { auth } from "~/utils/auth.server";

export const loader = async () => redirect("/");

export const action = async ({ request }: ActionArgs) =>
  auth.authenticate("auth0", request);
