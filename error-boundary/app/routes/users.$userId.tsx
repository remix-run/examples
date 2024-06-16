import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { getUsers } from "~/data.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // Handle our 404 gracefully by setting a generic error as page title
  if (!data || !data.user) {
    return [{ title: "User not found!" }];
  }
  return [{ title: data.user.name }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const userId = params.userId;

  const users = getUsers();
  const user = users.find(({ id }) => id === userId);

  if (!user) {
    // When there's an expected error (like no found user) throw a response.
    throw new Response("Not Found", { status: 404 });
  }

  return json({ user });
};

export default function User() {
  const { user } = useLoaderData<typeof loader>();
  return <div>Hi there {user.name}!</div>;
}

// Export an ErrorBoundary and use the useRouteError/isRouteErrorResponse
// combo to handle thrown responses like the 404 we have in our loader.
// You can also catch thrown responses from actions as well.
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    const params = useParams();

    return (
      <span style={{ color: "red" }}>
        User with ID "{params.userId}" not found!
      </span>
    );
  }

  console.error(error);

  return (
    <div>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}
