import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";
import { createTodo, getTodosFromList } from "~/db.server";
import { Sanitizer } from "~/utils/sanitizer";

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  if (request.method.toLowerCase() === "post") {
    const formData = await request.formData();
    const todoListId = params.listId || (formData.get("listId") as string);

    if (!todoListId || typeof todoListId !== "string") {
      throw json({ todo: null }, 400);
    }

    const existingTodos = await getTodosFromList(todoListId);

    try {
      const name = Sanitizer.cleanHtmlString(formData.get("name"));
      const description = Sanitizer.cleanHtmlString(
        formData.get("description")
      );
      const order = existingTodos.length - 1;

      if (!name) {
        throw json({ todo: null }, 400);
      }

      // TODO: Handle invalid inputs
      const todoData: Parameters<typeof createTodo>[0] = {
        name,
        order,
        todoListId,
        completed: false,
      };

      if (description) {
        todoData.description = description;
      }

      const todo = await createTodo(todoData);
      return json({ todo }, 200);
    } catch {
      return json({ todo: null }, 400);
    }
  }
  return json({ todo: null }, 400);
};
