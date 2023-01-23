import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { createUserSession } from "~/session.server";
import { sp, getIdp } from "~/saml.server";
import { updateUserProps } from "~/models/user.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  if (request.method !== "POST") {
    return redirect("/");
  }
  const body = Object.fromEntries(formData);
  const idp = await getIdp();
  const { extract } = await sp.parseLoginResponse(idp, "post", {
    body: body,
  });
  if (extract.nameID) {
    const next = body.RelayState ? body.RelayState : "/";
    const email = extract.nameID;

    const expiration = extract.conditions?.notOnOrAfter;

    // update user info
    const user = await updateUserProps(
      email,
      extract.attributes?.firstName,
      extract.attributes?.lastName,
      extract.attributes?.groups
    );

    // create a session
    return createUserSession({
      request: request,
      userId: user.id,
      expiration: expiration,
      redirectTo: next,
    });
  }

  // return to next url
  return redirect("/access_denied");
};

export async function loader({ request }: LoaderArgs) {
  // get request... send back to home page, we are here by accident.
  return redirect("/");
}
