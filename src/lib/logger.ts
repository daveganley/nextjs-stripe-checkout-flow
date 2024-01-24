import { env } from '@/env.mjs'

export function log(data: any) {
  if (
    env.NEXT_PUBLIC_ENV !== 'production' &&
    env.NEXT_PUBLIC_LOGGING_ENABLED === 'true'
  ) {
    console.log(data)
  }
}
