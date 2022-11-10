import type { FC } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { Form, useFetcher, useLoaderData } from '@remix-run/react'
import type { RemixWithXataExampleRecord } from '~/lib/xata.codegen.server'
import { getXataClient } from '~/lib/xata.codegen.server'

export const LINKS = [
  {
    description: 'Everything you need to know about Xata APIs and tools.',
    title: 'Xata Docs',
    url: 'https://docs.xata.io',
  },
  {
    description: 'In case you need to check some Remix specifics.',
    title: 'Remix Docs',
    url: 'https://remix.run/docs',
  },
  {
    description:
      'Maintain your flow by managing your Xata Workspace without ever leaving VS Code.',
    title: 'Xata VS Code Extension',
    url: 'https://marketplace.visualstudio.com/items?itemName=xata.xata',
  },
  {
    description: 'Get help. Offer help. Show us what you built!',
    title: 'Xata Discord',
    url: 'https://xata.io/discord',
  },
]

type TaskComponent = FC<
  Pick<RemixWithXataExampleRecord, 'id' | 'title' | 'url' | 'description'>
>
export const loader: LoaderFunction = async () => {
  const xata = getXataClient()
  const links = await xata.db.remix_with_xata_example.getAll()

  return links
}

export const action: ActionFunction = async ({ request }) => {
  const xata = getXataClient()
  const { action, item } = Object.fromEntries(await request.formData())

  if (action === 'delete' && typeof item === 'string') {
    await xata.db.remix_with_xata_example.delete(item)
    return {}
  }

  if (action === 'create') {
    await xata.db.remix_with_xata_example.create(LINKS)
    return {}
  }
}

const Task: TaskComponent = ({ id, title, url, description }) => {
  const fetcher = useFetcher()

  return fetcher.submission ? null : (
    <li key={url}>
      <a href={url ?? ''} rel="noopener noreferrer" target="_blank">
        {title}
      </a>
      <p>{description}</p>
      <fetcher.Form method="put">
        <input type="hidden" name="action" value="delete" />
        <button type="submit" name="item" value={id}>
          <span role="img" aria-label="delete item">
            🗑
          </span>
        </button>
      </fetcher.Form>
    </li>
  )
}

export default function Index() {
  const links = useLoaderData<RemixWithXataExampleRecord[]>()

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
            {links.map((link) => (
              <Task key={link.id} {...link} />
            ))}
          </ul>
        ) : (
          <section>
            <h2>No records found.</h2>
            <strong>
              Create a `remix_with_xata_example` and push some useful links to
              see them here.
            </strong>
            <Form method="post">
              <input type="hidden" name="action" value="create" />
              <button type="submit">Push records to Xata</button>
            </Form>
          </section>
        )}
      </article>
      <footer>
        <span>
          Made by{' '}
          <a href="https://xata.io" rel="noopener noreferrer" target="_blank">
            <object data="/xatafly.svg" aria-label="Xata Logo" />
          </a>
        </span>
      </footer>
    </main>
  )
}
