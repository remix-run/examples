import { type ActionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { sql } from "drizzle-orm";
import { db } from "~/db.server";
import { example } from "~/schema";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    await db.insert(example).values({});
    return new Response(null, { status: 201 });
  }

  if (intent == "reset") {
    await db.delete(example);
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 400 });
}

export async function loader() {
  const rowsQuery = db.query.example.findMany();

  const lastUpdatedQuery = db
    .select({ updated: sql<string>`MAX(created_at)` })
    .from(example)
    .execute()
    .then((rows) => rows[0].updated);

  return {
    rows: await rowsQuery,
    lastUpdated: await lastUpdatedQuery,
  };
}

export default function Index() {
  const { rows, lastUpdated } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <p>Last Updated: {lastUpdated ?? "--"}</p>
      <Form method="post">
        <button type="submit" name="intent" value="add">
          Add Row
        </button>
        <button type="submit" name="intent" value="reset">
          Reset
        </button>
      </Form>
      <ul>
        {rows.map((row) => (
          <li key={row.id}>{row.id}</li>
        ))}
      </ul>
    </div>
  );
}
