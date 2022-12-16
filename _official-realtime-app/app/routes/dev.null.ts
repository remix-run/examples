import { json } from "@remix-run/node";

// FIXME: Pointless action for revalidation until:
// https://github.com/remix-run/remix/issues/4485
export async function action() {
  return json({ ok: true });
}