import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  // In the official deployed version of the app, we don't want to deploy
  // a site with none-moderated content, so we only show users their own jokes
  const jokeListItems = user
    ? await db.joke.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
        take: 5,
        where: { jokesterId: user.id },
      })
    : [];

  return json({ jokeListItems, user });
};

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.length > 0 ? (
                data.jokeListItems.map(({ id, name }) => (
                  <li key={id}>
                    <Link prefetch="intent" to={id}>
                      {name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No jokes found</li>
              )}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="jokes-footer">
        <div className="container">
          <Link reloadDocument to="/jokes.rss">
            RSS
          </Link>
        </div>
      </footer>
    </div>
  );
}
