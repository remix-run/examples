import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getWorkshops } from "~/data.server";

export const loader = async () => {
  return json({ workshops: await getWorkshops() });
};

export default function Workshops() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>There are {data.workshops.length} workshops</h1>
      <ul>
        {data.workshops.map((workshop) => (
          <li key={workshop.id}>
            <Link to={workshop.id}>{workshop.title}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
      <Link to="/">Go home</Link>
    </div>
  );
}
