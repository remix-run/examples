import { type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { sql } from "drizzle-orm";
import { db } from "~/db.server";
import { example } from "~/schema";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let intent = formData.get("intent");

  if (intent === "update") {
    await db.insert(example).values({});
    return new Response(null, { status: 201 });
  }

  if (intent == "reset") {
    await db.delete(example);
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 400 });
}

export function loader() {
  let result = db
    .select({
      count: sql<number>`COUNT(*)`,
      lastUpdated: sql<string>`MAX(created_at)`,
    })
    .from(example)
    .get();

  return {
    count: result?.count ?? 0,
    lastUpdated: result?.lastUpdated ?? "never",
  };
}

export default function Index() {
  const { count, lastUpdated } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <p>
        Count: {count} <br />
        Last updated: {lastUpdated}
      </p>
      <Form method="post">
        <button type="submit" name="intent" value="update">
          Update
        </button>
        <button type="submit" name="intent" value="reset">
          Reset
        </button>
      </Form>
    </div>
  );
}
