import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/server-runtime";
import { handleTusRequest } from "../tusFileStoreHandler.server"

export async function action({ request }: ActionFunctionArgs) {
  const {method} = request;
  return handleTusRequest(request, method);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {method} = request;
  return handleTusRequest(request, method);
};
