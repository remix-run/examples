import { LoaderArgs, json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUserEmail } from "~/server/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedUser = await getUserEmail(request);
  return json({ loggedUser });
};

export default function Index() {
  const { loggedUser } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>MongoDB - Setup</h1>
      {loggedUser ? (
        <div>
          Logged in: {loggedUser}
          <p>
            <Form action="/logout" method="post">
              <button>
                Logout
              </button>
            </Form>
          </p>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
