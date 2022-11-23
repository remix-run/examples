import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getClients } from "~/db";

export const loader = async () => {
  const clients = await getClients();
  return json({
    clients: clients.map((c) => ({ id: c.id, name: c.name })),
  });
};

export default function ClientsRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Clients</h1>
      <ul>
        {data.clients.length
          ? data.clients.map((c) => (
              <li key={c.id}>
                <Link to={c.id}>{c.name}</Link>
              </li>
            ))
          : "You got no clients"}
      </ul>
      <Outlet />
    </div>
  );
}
