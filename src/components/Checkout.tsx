'use client'

import { type FormEvent, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { env } from '@/env.mjs'
import { Button } from '@/components/ui/button'
import StripeTestCards from '@/components/StripeTestCards'
import { log } from '@/lib/logger'

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout() {
  const [loading, setLoading] = useState<boolean>(false)

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    const stripe = await stripePromise

    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: '281fc01a-3037-419a-a15f-f3b4231b60a4',
          email: 'test@test.com',
        }), // result hash, email, etc.
      })

      const { sessionId } = await response.json()
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        setLoading(false)
        log(error)
      }
    } catch (error) {
      setLoading(false)
      log(error)
    }
  }

  return (
    <form onSubmit={handleCheckout}>
      <StripeTestCards />
      <Button type='submit' role='link' disabled={loading}>
        {loading ? 'Redirecting to Stripe...' : 'Checkout'}
      </Button>
    </form>
  )
}
