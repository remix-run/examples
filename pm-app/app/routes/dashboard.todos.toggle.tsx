import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getTodo, updateTodo } from "~/db.server";
import { requireUser } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  const formData = await request.formData();
  const todoId = formData.get("todo");

  if (!todoId || typeof todoId !== "string") {
    throw json({ message: "Bad request", todo: null }, 400);
  }
  const todo = await getTodo(todoId);
  if (!todo) {
    throw json({ message: "No todo found", todo: null }, 400);
  }

  await updateTodo(todoId, { completed: !todo.completed });
  return json({ message: "Success", todo }, 200);
};
