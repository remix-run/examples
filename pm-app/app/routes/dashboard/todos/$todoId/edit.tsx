import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUser } from "~/session.server";
import { updateTodo } from "~/db.server";
import { Sanitizer } from "~/utils/sanitizer";

export const action = async ({ context, params, request }: ActionArgs) => {
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
      const status = formData.get("id");

      const name = Sanitizer.cleanHtmlString(formData.get("name"));
      const description = Sanitizer.cleanHtmlString(
        formData.get("description")
      );

      // TODO: Handle invalid inputs
      const todoUpdates: Parameters<typeof updateTodo>[1] = {};
      if (status !== undefined) {
        if (status === "off") {
          todoUpdates.completed = false;
        } else {
          todoUpdates.completed = status === "on";
        }
      }

      if (name != null) {
        todoUpdates.name = name;
      }

      if (description != null) {
        todoUpdates.description = description;
      }

      const todo = await updateTodo(todoId, todoUpdates);
      return json({ todo }, 200);
    } catch {
      return json({ todo: null }, 400);
    }
  }
  return json({ todo: null }, 400);
};
