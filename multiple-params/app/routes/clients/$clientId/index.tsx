import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getClient } from "~/db";

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.clientId) {
    throw new Response(`No client ID provided`, {
      status: 404,
    });
  }
  const client = await getClient(params.clientId);
  if (!client) {
    throw new Response(`No client found by ID ${params.clientId}`, {
      status: 404,
    });
  }

  return json({
    client: {
      id: client.id,
      email: client.email,
      name: client.name,
    },
  });
};

export default function ClientIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <strong>{data.client.name} Information</strong>
      <ul>
        <li>
          <strong>ID:</strong> {data.client.id}
        </li>
        <li>
          <strong>Email:</strong> {data.client.email}
        </li>
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>Uh oh. I did a whoopsies</div>;
}
