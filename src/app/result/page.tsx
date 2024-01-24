import { stripe } from '@/clients/stripe'
import type { Stripe } from 'stripe'

export default async function Page({
  searchParams,
}: {
  searchParams: { sid: string }
}) {
  if (!searchParams.sid)
    throw new Error('Please provide a valid sid (`cs_test_...`)')

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.sid, {
      expand: ['line_items', 'payment_intent'],
    })

  const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent

  return (
    <>
      <h2>Status: {paymentIntent.status}</h2>
      <h3>Checkout Session response:</h3>
      <>{JSON.stringify(checkoutSession)}</>
    </>
  )
}
