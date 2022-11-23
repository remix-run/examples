import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useCatch,
  useLoaderData,
  useParams,
} from "@remix-run/react";

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

  return json({ client: { name: client.name } });
};

export default function ClientRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>{data.client.name}</h2>
      <div>
        <strong>{data.client.name} Links</strong>
        <ul>
          <li>
            <Link to=".">Home</Link>
          </li>
          <li>
            <Link to="invoices">Invoices</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

export function CatchBoundary() {
  const params = useParams();
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div>
        Huh... Couldn't find an client with the ID of: {params.clientId}
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>Uh oh. I did a whoopsies</div>;
}
