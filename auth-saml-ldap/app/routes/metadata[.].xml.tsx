import { metadata } from "~/saml.server";

export const loader = async () => {
  const meta = metadata();
  return new Response(meta, {
    status: 200,
    headers: {
      "Content-Type": "text/xml",
    },
  });
};
