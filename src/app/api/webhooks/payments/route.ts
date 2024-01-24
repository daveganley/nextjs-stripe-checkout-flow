import { stripe } from '@/clients/stripe'
import { env } from '@/env.mjs'
import { log } from '@/lib/logger'
import type { Stripe } from 'stripe'

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    // On error, log and return the error message.
    if (error! instanceof Error) log(error)
    log(`Error message: ${errorMessage}`)

    return Response.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Successfully constructed event.
  log(`✅ Success: ${event.id}`)

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ]

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session

          log(`CheckoutSession status: ${data.payment_status}`)
          log(`CheckoutSession id: ${data.id}`)
          break

        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent

          log(`Payment failed: ${data.last_payment_error?.message}`)
          break

        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent

          log(`PaymentIntent status: ${data.status}`)
          log(`PaymentIntent id: ${data.id}`)
          break

        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      log(error)
      return Response.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return Response.json({ message: 'Received' }, { status: 200 })
}
