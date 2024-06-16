import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { gdprConsent } from "~/cookies.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await gdprConsent.parse(cookieHeader)) || {};

  if (formData.get("accept-gdpr") === "true") {
    cookie.gdprConsent = true;
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await gdprConsent.serialize(cookie),
      },
    },
  );
};
