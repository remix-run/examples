import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";
import { updateTodo } from "~/db.server";

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  if (request.method.toLowerCase() === "post") {
    const todoId = params.todoId as string;

    if (!todoId || typeof todoId !== "string") {
      throw json({ todo: null }, 400);
    }

    try {
      const formData = await request.formData();
      const status = params.id || formData.get("id");
      const todo = await updateTodo(todoId, {
        completed: status === "on",
      });
      return json({ todo }, 200);
    } catch {
      return json({ todo: null }, 400);
    }
  }
  return json({ todo: null }, 400);
};
