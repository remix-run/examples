import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/server-runtime";
import { handleTusRequest } from "../tusCloudBucketHandler.server";
import { json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const {method} = request;
  return handleTusRequest(request, method);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const method = request.method;
  const urlToSearch = new URL(request.url);
  const id = urlToSearch.searchParams.get("id") || "";
  const mediaType = urlToSearch.searchParams.get("mediaType") || "";
  const bucketName = urlToSearch.searchParams.get("bucketName") || "";
  const data = await handleTusRequest(request, method, id, mediaType, bucketName);

  return json({ data });
};
