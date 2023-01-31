import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'
import type { ReactNode } from 'react'

import { withEmotionCache } from '@emotion/react'
import { ThemeProvider } from 'theme-ui'
import { useContext, useEffect } from 'react'

import { ServerStyleContext, ClientStyleContext } from './styles/context'
import { theme } from './styles/theme'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Theme UI on Remix React 18 with Emotion 11',
  viewport: 'width=device-width,initial-scale=1',
})

type DocumentProps = {
  children: ReactNode
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext)
  const clientStyleData = useContext(ClientStyleContext)
  const resetClientStyleData = clientStyleData?.reset ? clientStyleData.reset : () => void 0

  // Reset style only on client
  useEffect(() => {
    resetClientStyleData()
  }, [resetClientStyleData])

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style key={key} data-emotion={`${key} ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
})

export default function App() {
  return (
    <Document>
      <ThemeProvider theme={theme}>
        <Outlet />
      </ThemeProvider>
    </Document>
  )
}
