import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/server-runtime";
import { handleTusRequest } from "../tusCloudBucketHandler.server";

export async function action({ request }: ActionFunctionArgs) {
  const {method} = request;
  if (method !== "PATCH") {
    return json({ message: "Method not allowed" }, 405);
  }

  return handleTusRequest(request, method);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const method = request.method;
  return handleTusRequest(request, method);
}
