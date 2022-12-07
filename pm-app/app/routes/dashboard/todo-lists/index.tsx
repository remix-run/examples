import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { getAllTodoLists } from "~/db.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  const lists = await getAllTodoLists();
  return json({ lists });
};

export default function AllLists() {
  const { lists } = useLoaderData<typeof loader>();

  return (
    <div>
      {lists.map((list) => {
        return (
          <div key={list.id} className="flex gap-2">
            <div>Name: {list.name}</div>
            <div>ID: {list.id}</div>
            <div>
              Project:{" "}
              <Link to={`/dashboard/projects/${list.projectId}`}>
                {list.projectId}
              </Link>
            </div>
            <div>
              Todos:{" "}
              {list.todos.length > 0 ? (
                <ul>
                  {list.todos.map((todo) => (
                    <li key={todo.id}>{todo.name}</li>
                  ))}
                </ul>
              ) : (
                "None"
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
