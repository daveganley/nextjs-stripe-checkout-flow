'use client'

import { useEffect } from 'react'
import { env } from '@/env.mjs'
import Rollbar, { Configuration } from 'rollbar'

const clientConfig: Configuration = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: env.NEXT_PUBLIC_ENV,
  enabled: env.NEXT_PUBLIC_ENV !== 'development',
  accessToken: env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
}

const rollbar = new Rollbar(clientConfig)

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    rollbar.error(error)
  }, [error])

  return (
    <main className={'flex h-screen items-center justify-center'}>
      <h3 className={'font-sans text-2xl'}>An error has occurred</h3>
    </main>
  )
}
