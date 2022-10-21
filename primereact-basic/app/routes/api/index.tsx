import { json } from "@remix-run/node";

export async function loader() {
  return json([{
    "message": "I'm an API"
  }]);
}