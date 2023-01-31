import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import type { FunctionComponent } from 'react'
import { useCallback, useState } from 'react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { ClientStyleContext } from './styles/context'
import { createEmotionCache } from './styles/createEmotionCache'

type Props = {
  children: React.ReactNode
}

const ClientCacheProvider: FunctionComponent<Props> = ({ children }) => {
  const [cache, setCache] = useState(createEmotionCache())

  const reset = useCallback(() => setCache(createEmotionCache()), [])

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <ClientCacheProvider>
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      </ClientCacheProvider>
    )
  })
}

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1)
}
