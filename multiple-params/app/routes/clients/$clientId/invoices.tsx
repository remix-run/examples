import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

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
    invoices: client.invoices.map((i) => ({ id: i.id, title: i.title })),
  });
};

export default function ClientRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h3>Invoices</h3>
      <ul>
        {data.invoices.map((invoice) => (
          <li key={invoice.id}>
            <Link to={invoice.id}>{invoice.title}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>Uh oh. I did a whoopsies</div>;
}
