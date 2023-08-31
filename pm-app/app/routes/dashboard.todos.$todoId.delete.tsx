import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { deleteTodo } from "~/db.server";
import { requireUser } from "~/session.server";

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
      return json({ todo: await deleteTodo(todoId) });
    } catch {
      return json({ todo: null }, 400);
    }
  }
  return json({ todo: null }, 400);
};
