import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import type { ItemsService as TItemsService } from "@directus/api/services/items";
import { Link, useLoaderData } from "@remix-run/react";
import type { Posts } from "../types";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const ItemsService = (context.services as any)
    .ItemsService as typeof TItemsService<Posts>;
  const itemsService = new ItemsService("posts", {
    schema: context.schema as any,
    accountability: { admin: true, role: "" },
  });

  const posts = await itemsService.readByQuery({
    fields: ["id", "slug", "title"],
    filter: { status: { _eq: "published" } },
    sort: ["-date_published"],
    limit: -1,
  });
  return json({ posts });
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>My Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
