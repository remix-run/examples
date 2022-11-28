import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);

  // in the official deployed version of the app, we don't want to deploy
  // a site with unmoderated content, so we only show users their own jokes
  const [randomJoke] = userId
    ? await db.joke.findMany({
        take: 1,
        skip: randomRowNumber,
        where: {
          jokesterId: userId,
        },
      })
    : [];
  if (!randomJoke) {
    throw new Response("No jokes to be found!", { status: 404 });
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>
          There are no jokes to display.
          <br />
          <small>
            Note: this is the deployed version of the jokes app example and
            because we don't want to show you unmoderated content, we only
            display jokes you create in this version.
          </small>
        </p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <div>I did a whoopsies.</div>;
}
