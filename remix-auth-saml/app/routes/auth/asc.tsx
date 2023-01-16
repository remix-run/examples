import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { createUserSession } from "~/session.server";
import { sp, getIdp } from "~/saml.server";
import { redirect } from "@remix-run/node";
import { createUser, getUserByEmail } from "~/models/user.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  if (request.method == "POST") {
    const body = Object.fromEntries(formData);
    const idp = await getIdp();
    const { samlContent, extract } = await sp.parseLoginResponse(idp, "post", {
      body: body,
    });
    if (extract.nameID) {
      const next = body.RelayState ? body.RelayState : "/";
      const email = extract.nameID;

      const expiration = extract.conditions?.notOnOrAfter;

      // get or create user
      let user = await getUserByEmail(email);

      if (!user) user = await createUser(email);

      return createUserSession({
        request: request,
        userId: user.id,
        expiration: expiration,
        redirectTo: next,
      });
    }

    // return to next url
    return redirect("/access_denied");
  } else {
    return redirect("/");
  }
};
