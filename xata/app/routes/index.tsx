import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FC } from "react";

// @ts-expect-error
import type { RemixWithXataExampleRecord } from "~/lib/xata.codegen.server";
// @ts-expect-error
import { getXataClient } from "~/lib/xata.codegen.server";

export const LINKS = [
  {
    description: "Everything you need to know about Xata APIs and tools.",
    title: "Xata Docs",
    url: "https://docs.xata.io",
  },
  {
    description: "In case you need to check some Remix specifics.",
    title: "Remix Docs",
    url: "https://remix.run/docs",
  },
  {
    description:
      "Maintain your flow by managing your Xata Workspace without ever leaving VS Code.",
    title: "Xata VS Code Extension",
    url: "https://marketplace.visualstudio.com/items?itemName=xata.xata",
  },
  {
    description: "Get help. Offer help. Show us what you built!",
    title: "Xata Discord",
    url: "https://xata.io/discord",
  },
];

type TaskComponent = FC<
  Pick<RemixWithXataExampleRecord, "id" | "title" | "url" | "description">
>;
export const loader = async () => {
  const xata = getXataClient();
  const links = await xata.db.remix_with_xata_example.getAll();

  return json(links);
};

export const action = async ({ request }: ActionArgs) => {
  const xata = getXataClient();
  const { intent, id } = Object.fromEntries(await request.formData());

  if (intent === "delete" && typeof id === "string") {
    await xata.db.remix_with_xata_example.delete(id);

    return json({
      message: "delete: success",
      data: null,
    });
  }

  if (intent === "create") {
    const newItem = await xata.db.remix_with_xata_example.create(LINKS);

    return json({
      message: "create: success",
      data: newItem,
    });
  }

  return json({
    message: "no action performed",
    data: null,
  });
};

const Task: TaskComponent = ({ id, title, url, description }) => {
  const fetcher = useFetcher();

  return fetcher.submission ? null : (
    <li key={url}>
      <a href={url ?? ""} rel="noopener noreferrer" target="_blank">
        {title}
      </a>
      <p>{description}</p>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={id} />
        <button type="submit" name="intent" value="delete">
          <span role="img" aria-label="delete item">
            🗑
          </span>
        </button>
      </fetcher.Form>
    </li>
  );
};

export default function Index() {
  const links = useLoaderData<typeof loader>();

  return (
    <main>
      <header>
        <img src="/flap.gif" alt="Xata Logo" />
        <h1>
          Remix with<span aria-hidden>&#8209;</span>xata
        </h1>
      </header>
      <article>
        {links.length > 0 ? (
          <ul>
            {links.map((link: any) => (
              <Task key={link.id} {...link} />
            ))}
          </ul>
        ) : (
          <section>
            <h2>No records found.</h2>
            <strong>
              Click the button below to add some useful links to your
              `remix_with_xata_example` table and see them here.
            </strong>
            <Form method="post">
              <button type="submit" name="intent" value="create">
                Push records to Xata
              </button>
            </Form>
          </section>
        )}
      </article>
      <footer>
        <span>
          Made by{" "}
          <a href="https://xata.io" rel="noopener noreferrer" target="_blank">
            <object data="/xatafly.svg" aria-label="Xata Logo" />
          </a>
        </span>
      </footer>
    </main>
  );
}
