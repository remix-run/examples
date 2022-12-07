import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { deleteTodoList } from "~/db.server";
import { requireUser } from "~/session.server";

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });
  const listId = params.listId as string;
  if (listId) {
    await deleteTodoList(listId);
  }
  return redirect("/dashboard");
};

export const loader = async ({ params, request }: LoaderArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });
  const listId = params.listId as string;
  if (listId) {
    await deleteTodoList(listId);
  }
  return redirect("/dashboard");
};
