import { metadata } from "~/saml.server";

export async function loader({ params }: LoaderArgs) {
  const meta = metadata();
  return new Response(meta, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
