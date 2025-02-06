import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import './tailwind.css'

/**
 * Retrieves and stringifies specific environment variables for browser exposure.
 *
 * @function getBrowserEnvironment
 * @returns {string} A JSON string containing the public environment variables.
 *
 * @note
 * - Only variables listed in `exposedVariables` will be included in the output.
 * - Do not add secret variables to the `exposedVariables` array.
 */
const getBrowserEnvironment = () => {
  const exposedVariables = ['API_BASE']
  const env = Object.keys(process.env)
    .filter((key) => exposedVariables.includes(key))
    .reduce((obj: Record<string, string>, key) => {
      obj[key] = process.env[key]!
      return obj
    }, {})
  return JSON.stringify(env)
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process={env:${getBrowserEnvironment()}}`,
          }}
        />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
