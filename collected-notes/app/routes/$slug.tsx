import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { cn, sitePath } from "~/cn.server";

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;
  if (typeof slug !== "string") throw new Error("Missing slug");
  const { body } = await cn.body(sitePath, slug);
  return json({ body });
};

export default function Screen() {
  const { body } = useLoaderData<typeof loader>();
  return (
    <main>
      <article dangerouslySetInnerHTML={{ __html: body }} />
    </main>
  );
}
