import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useFetchers, useLoaderData } from "@remix-run/react";
import * as React from "react";

import {
  getProjects,
  getTodo,
  getTodoList,
  updateTodo,
  updateTodoList,
} from "~/db.server";
import stylesUrl from "~/dist/styles/routes/dashboard/todo-lists/$listId/index.css";
import type { TodoList as TTodoList, Todo } from "~/models";
import { requireUser } from "~/session.server";
import { Button } from "~/ui/button";
import { Field, FieldProvider, Label } from "~/ui/form";
import { Link } from "~/ui/link";
import { MaxContainer } from "~/ui/max-container";
import { Heading, Section } from "~/ui/section-heading";
import { Stack } from "~/ui/stack";
import { TodoItem, TodoList } from "~/ui/todo-list";

// TODO: Add feature: Allow reassigning list to a different project

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${
      data.todoList ? data.todoList.name?.trim() : "List Overview"
    } | PM Camp`,
  };
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const listId = params.listId as string;
  await requireUser(request, {
    redirect: "/sign-in",
  });

  const [todoList, projects] = await Promise.all([
    getTodoList(listId),
    getProjects(),
  ]);

  if (!todoList) {
    throw redirect("/dashboard");
  }

  const project = projects.find((p) => p.id === todoList?.projectId);

  if (!project) {
    // TODO:
    throw redirect("/dashboard");
  }

  return json({ todoList, projects, project });
};

export const action = async ({ params, request }: ActionArgs) => {
  await requireUser(request, {
    redirect: "/sign-in",
  });

  const listId = params.listId as string;
  const formData = await request.formData();
  const assign = formData.get("assign");
  const todoId = formData.get("todo");

  if (todoId) {
    if (!todoId || typeof todoId !== "string") {
      throw json({ message: "Bad request", todo: null }, 400);
    }
    const todo = await getTodo(todoId);
    if (!todo) {
      throw json({ message: "No todo found", todo: null }, 400);
    }

    await updateTodo(todoId, { completed: !todo.completed });
    return json({ message: "Success", todo }, 200);
  }

  // Handle project assignment
  else if (assign) {
    let projectId = formData.get("project") as string | null;
    if (projectId === "null") {
      projectId = null;
    }
    const fieldErrors: FieldErrors = { project: null };
    if (projectId != null && typeof projectId !== "string") {
      return json({
        formError: `Something went wrong. Please try again later.`,
      });
    }
    const fields: Fields = { project: projectId };
    if (Object.values(fieldErrors).some(Boolean)) {
      return json({ fieldErrors, fields });
    }
    if (projectId) {
      await updateTodoList(listId, { projectId });
    }
    return json({
      fieldErrors,
      fields,
    });
  }

  return json({});
};

function TodoListRoute() {
  const { todoList, project } = useLoaderData<typeof loader>();

  const fetchers = useFetchers();
  const taskFetcherMap = new Map<string, boolean>();
  // @ts-expect-error
  const allTodos: Todo[] = todoList.todos;
  for (const fetcher of fetchers) {
    if (fetcher.type === "actionSubmission") {
      const todoId = fetcher.submission.formData.get("id") as string;
      if (
        fetcher.submission.action.startsWith(`/dashboard/todos/${todoId}/edit`)
      ) {
        taskFetcherMap.set(
          todoId,
          fetcher.submission.formData.get("complete") === "on"
        );
      }
      if (fetcher.submission.action.startsWith("/dashboard/todos/new")) {
        // temporarily add a todo; it will be updated on the next render
        allTodos.push({
          id: String(allTodos.length + 1),
          todoListId: todoList.id,
          name: fetcher.submission.formData.get("name") as string,
          completed: false,
        } as Todo);
      }
      if (
        fetcher.submission.action.startsWith(
          `/dashboard/todos/${todoId}/delete`
        )
      ) {
        const todoId = fetcher.submission.formData.get("todoId");
        allTodos.filter((todo) => todoId === todo.id);
      }
    }
  }

  function getTodoCompletionState(todo: Todo) {
    return isTodoCompleted(taskFetcherMap, todo);
  }

  const [completeTodos, incompleteTodos] = (() => {
    const completeTodos: Todo[] = [];
    const imcompleteTodos: Todo[] = [];
    for (const todo of allTodos) {
      (getTodoCompletionState(todo) ? completeTodos : imcompleteTodos).push(
        todo
      );
    }
    return [completeTodos, imcompleteTodos] as const;
  })();

  return (
    <MaxContainer className="todolist-index">
      <div className="todolist-index__header">
        <div className="todolist-index__header-inner">
          <Heading level={1}>{todoList.name}</Heading>
          {todoList.description ? <p>{todoList.description}</p> : null}
          <div>
            <p>
              <strong>Project:</strong>{" "}
              <Link to={`/dashboard/projects/${project.id}`}>
                {project.name}
              </Link>
            </p>
          </div>
          <hr />
        </div>
      </div>
      <Section
        className="todolist-index__section todolist-index__lists"
        aria-label="Todos"
        as="section"
      >
        <div className="todolist-index__lists-list">
          <div>
            {allTodos.length > 0 ? (
              <Stack gap={5}>
                <div>
                  <Heading className="mb-2">Incomplete</Heading>
                  {incompleteTodos.length > 0 ? (
                    <TodoList>
                      {incompleteTodos.map((todo) => {
                        return <TodoItem todo={todo} key={todo.id} />;
                      })}
                    </TodoList>
                  ) : (
                    <p>All done! 🥳</p>
                  )}
                </div>

                <div>
                  <Heading className="mb-2">Complete</Heading>
                  {completeTodos.length > 0 ? (
                    <TodoList>
                      {completeTodos.map((todo) => {
                        return <TodoItem key={todo.id} todo={todo} />;
                      })}
                    </TodoList>
                  ) : (
                    <p>Nothing here. Let's get to work! 💪</p>
                  )}
                </div>

                <hr />

                <NewTodoForm listId={todoList.id} />
              </Stack>
            ) : (
              <div>
                <p className="mb-5">
                  No todos for this list yet. Let's get started! 📝
                </p>
                <NewTodoForm listId={todoList.id} />
              </div>
            )}
          </div>
        </div>
      </Section>
    </MaxContainer>
  );
}

function NewTodoForm({ listId }: { listId: TTodoList["id"] }) {
  const todoFetcher = useFetcher();

  const [value, setValue] = React.useState("");
  const submissionAction = todoFetcher.submission?.action;
  React.useEffect(() => {
    if (submissionAction?.startsWith("/dashboard/todos/new")) {
      setValue("");
    }
  }, [submissionAction]);

  return (
    <todoFetcher.Form
      action="/dashboard/todos/new"
      className="flex flex-col gap-4"
      method="post"
    >
      <input type="hidden" name="listId" value={listId} />
      <FieldProvider
        name="name"
        id="new-todo"
        required
        disabled={todoFetcher.state !== "idle"}
      >
        <Label>New Todo</Label>
        <Field value={value} onChange={(e) => setValue(e.target.value)} />
      </FieldProvider>
      <div>
        <Button className="flex-shrink-0">Create Todo</Button>
      </div>
    </todoFetcher.Form>
  );
}

export default TodoListRoute;

type Fields = Record<SelectFields, string | null>;
type FieldErrors = Record<SelectFields, string | undefined | null>;

type SelectFields = "project";

function isTodoCompleted(taskFetchers: Map<string, boolean>, todo: Todo) {
  // Use the optimistic state if it exists
  if (taskFetchers.has(todo.id)) {
    if (taskFetchers.get(todo.id)) {
      return true;
    }
  }
  // Use the true state
  return todo.completed;
}
