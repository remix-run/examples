import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { updateIssue } from "~/data";
import { emitter, EVENTS } from "~/events";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const updates = Object.fromEntries(await request.formData());
  invariant(params.id, "Missing issue id");
  const result = await updateIssue(params.id, updates);
  emitter.emit(EVENTS.ISSUE_CHANGED, Date.now());
  return json(result);
};
