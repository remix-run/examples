import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";
import { getTodo, updateTodo } from "~/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const todoId = params.todoId as string;
  await requireUser(request, {
    redirect: "/sign-in",
  });

  const todo = await getTodo(todoId);

  if (!todo) {
    return json({ todo: null }, 404);
  }

  return json({ todo });
};

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  // Toggle actions
  if (request.method.toLowerCase() === "post") {
    const todoId = params.todoId as string;

    if (!todoId || typeof todoId !== "string") {
      throw json({ todo: null }, 400);
    }

    try {
      const formData = await request.formData();
      const status = formData.get("id");

      const todo = await updateTodo(todoId, {
        completed: status === "on",
      });
      return json({ todo }, 200);
    } catch {
      return json({ todo: null }, 400);
    }
  }
  return json({ message: "Bad request", todo: null }, 400);
};
