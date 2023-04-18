import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("No random joke found", { status: 404 });
  }

  // In the official deployed version of the app, we don't want to deploy
  // a site with none-moderated content, so we only show users their own jokes
  const count = await db.joke.count({ where: { jokesterId: userId } });
  const randomRowNumber = Math.floor(Math.random() * count);

  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1,
    where: { jokesterId: userId },
  });
  if (!randomJoke) {
    throw new Response("No random joke found", { status: 404 });
  }
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>
          There are no jokes to display.
          <br />
          <small>
            Note: this is the deployed version of the jokes app example and
            because we don't want to show you none-moderated content, we only
            display jokes you create in this version.
          </small>
        </p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }

  return <div className="error-container">I did a whoopsies.</div>;
}
