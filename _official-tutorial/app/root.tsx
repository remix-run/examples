import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useSubmit,
  useNavigation,
  useFetchers,
} from "@remix-run/react";
import * as React from "react";

import appStylesHref from "~/app.css";
import type { ContactRecord } from "~/data";
import { createEmptyContact, getContacts } from "~/data";
import ErrorPage from "~/error-page";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  // type inference over the network from `typeof loader`
  const { contacts, q } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const submit = useSubmit();

  // Figure out if the user is searching
  const searching =
    // if navigation.location exists, then we're in the middle of a navigation
    // and data is being fetched for the next page
    navigation.location &&
    // if we also have a search query, then we're searching
    new URLSearchParams(navigation.location.search).has("q");

  // The rules around React "controlled inputs" don't really make sense when the
  // URL and the user are driving the UI and not React state. We could wire up
  // some react state to the the input, but we'd still need this useEffect to
  // synchronize the URL to the state. If we have to do manual synchronization
  // anyway, it's more straightforward and less code to just synchronize the URL
  // to the input manually. It's okay, Andrew won't arrest you. He's not even a
  // cop.
  React.useEffect(() => {
    const input = document.getElementById("q");
    if (input && input instanceof HTMLInputElement && q) {
      input.value = q;
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={appStylesHref} />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">
          <div id="sidebar">
            <h1>Remix Contacts</h1>
            <div>
              <Form
                id="search-form"
                role="search"
                onSubmit={(event) => {
                  // this form is submitted as the user types with JS, if they
                  // hit "enter" we want to prevent submitting a useless search.
                  // If JS hasn't loaded in the browser yet, hitting enter will
                  // work.
                  event.preventDefault();
                }}
              >
                <input
                  id="q"
                  className={searching ? "loading" : ""}
                  aria-label="Search contacts"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  onChange={(event) => {
                    const isSubsequentSearch = q != null;
                    submit(event.currentTarget.form, {
                      // If this is the first search, push a new entry into the
                      // history stack so the user can click back to no search.
                      // If it's a subsequent search, replace the current
                      // location so the user doesn't have click "back" for
                      // every daggum character they've typed
                      replace: isSubsequentSearch,
                    });
                  }}
                />
                <div id="search-spinner" aria-hidden hidden={!searching} />
              </Form>
              <Form method="post">
                <button type="submit">New</button>
              </Form>
            </div>
            <nav>
              {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        prefetch="intent"
                        to={`contacts/${contact.id}`}
                        className={({ isActive, isPending }) =>
                          isActive ? "active" : isPending ? "pending" : ""
                        }
                      >
                        {contact.firstName || contact.lastName ? (
                          <>
                            {contact.firstName} {contact.lastName}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        <OptimisticFavorite contact={contact} />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
          </div>
          <div id="detail">
            <Outlet />
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <ErrorPage error={error} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  const error = new Error(caught.statusText);
  return <ErrorPage error={error} />;
}

function OptimisticFavorite({ contact }: { contact: ContactRecord }) {
  const fetchers = useFetchers();

  // start with the default case, read the actual data.
  let isFavorite = contact.favorite;

  // Now check if there are any pending fetchers that are changing this contact
  for (const fetcher of fetchers) {
    if (fetcher.formAction === `/contacts/${contact.id}`) {
      // Ask for the optimistic version of the data
      isFavorite = fetcher.formData.get("favorite") === "true";
    }
  }

  // Now the star in the sidebar will immediately update as the user clicks
  // instead of waiting for the network to respond
  return isFavorite ? <span>★</span> : null;
}
