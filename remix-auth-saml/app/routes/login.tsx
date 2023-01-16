/*
login page would never be direcly accessed by users clicking a link.
just send them to a page that needs to be authenticated and they will
automatically be logged in :)
*/

import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { getIdp, sp } from "~/saml.server";
import { safeRedirect, validateEmail } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    const idp = await getIdp();
    const { id, context } = sp.createLoginRequest(idp, "redirect");
    const url = new URL(request.url);
    const pathname = url.searchParams.get("redirectTo") || "/";
    return redirect(context + "&RelayState=" + pathname);
  }
  // fallback if someone accidentally landed here and was already logged in.
  if (userId) return redirect("/");
}
