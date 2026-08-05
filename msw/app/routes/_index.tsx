import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
  const res = await fetch(`${process.env.API_BASE}/user`)
  const data = await res.json()
  return json(data)
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  )
}
