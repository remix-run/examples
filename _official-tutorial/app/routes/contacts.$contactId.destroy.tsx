import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "~/data";

// This route is interesting because it doesn't export a component but redirects
// once the action is complete. Routes don't have to have components!
export async function action({ params }: ActionArgs) {
  invariant(params.contactId, "Missing contactId param");
  await deleteContact(params.contactId);
  return redirect("/");
}
