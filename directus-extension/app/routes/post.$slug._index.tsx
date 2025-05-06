import { type LoaderFunctionArgs } from "@remix-run/node";
import type { Posts } from "~/types";
import type { ItemsService as TItemsService } from "@directus/api/services/items";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const ItemsService = (context.services as any)
    .ItemsService as typeof TItemsService<Posts>;
  const itemsService = new ItemsService("posts", {
    schema: context.schema as any,
    accountability: { admin: true, role: "" },
  });

  const [post] = await itemsService.readByQuery({
    limit: 1,
    filter: { slug: { _eq: params.slug }, status: { _eq: "published" } },
    fields: ["*"],
  });

  if (!post)
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });

  return { post };
}

const formatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
export default function Post() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Link to="/">Back</Link>
      <h1>{post.title}</h1>
      <p>
        Published: {formatter.format(Number(new Date(post.date_published)))}
      </p>
      <img
        src={`/assets/${post.image}`}
        alt={post.title}
        style={{ maxWidth: "100%" }}
      />
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
    </div>
  );
}
