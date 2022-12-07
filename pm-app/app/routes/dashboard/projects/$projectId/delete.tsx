import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { deleteProject } from "~/db.server";
import { requireUser } from "~/session.server";

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });
  const projectId = params.projectId as string;
  if (projectId) {
    try {
      await deleteProject(projectId);
    } catch (error: unknown) {
      console.error(error);
    }
  }
  return redirect("/dashboard");
};
