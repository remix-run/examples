import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { users } from "~/data.server";

export const meta: MetaFunction = () => {
  return { title: "Users" };
};

export const loader = async () => {
  return json({ users });
};

export default function Users() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div>
      <ul>
        {users.map(({ id, name }) => (
          <Link to={id} key={id}>
            <li>{name}</li>
          </Link>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
