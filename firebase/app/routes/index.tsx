import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import type { FunctionComponent } from "react";
import { useEffect, useRef } from "react";

import { requireAuth } from "~/server/auth.server";
import { addTodo, getUserTodos, removeTodo } from "~/server/db.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuth(request);
  const todos = await getUserTodos(user.uid);
  return json({
    message: `Hello ${user.displayName || "unknown"}!`,
    todos,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const { uid } = await requireAuth(request);
  const form = await request.formData();
  const intent = form.get("intent");
  if (intent === "create") {
    const title = form.get("title");
    if (typeof title !== "string" || title.length === 0) {
      return json({ error: "title is required" }, { status: 400 });
    }

    await addTodo(uid, title);
    return redirect("/");
  }
  if (intent === "delete") {
    const id = form.get("id");
    if (typeof id !== "string") {
      return json({ error: "id is required" }, { status: 400 });
    }
    await removeTodo(uid, id);
    return redirect("/");
  }
  return json({ error: "unknown method" }, { status: 400 });
};

const TodoComponent: FunctionComponent<{ id: string; title: string }> = ({
  id,
  title,
}) => {
  const fetcher = useFetcher();
  return (
    <li>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        <span>{title}</span>
        <button type="submit" name="intent" value="delete">
          Delete
        </button>
      </fetcher.Form>
    </li>
  );
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);
  return (
    <div>
      <h1>{data.message}</h1>
      <p>
        Want to <Link to="/logout">log out</Link>?
      </p>
      {actionData?.error ? (
        <p style={{ color: "red" }}>{actionData.error}</p>
      ) : null}
      <Form method="post">
        <h2>Create new Todo:</h2>
        <input ref={ref} name="title" type="text" placeholder="Get Milk" />
        <button type="submit" name="intent" value="create">
          Create
        </button>
      </Form>
      <ul>
        {data.todos.map((todo) => (
          <TodoComponent key={todo.id} {...todo} />
        ))}
      </ul>
    </div>
  );
}
