import { stripe } from '@/clients/stripe'
import { log } from '@/lib/logger'
import type { Stripe } from 'stripe'

export async function POST(_req: Request) {
  try {
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
      await stripe.paymentIntents.create({
        amount: 500 * 100,
        currency: 'AUD',
      })

    return Response.json(
      { client_secret: paymentIntent.client_secret },
      { status: 200 }
    )
  } catch (error) {
    log(error)
    return Response.json({ error: error }, { status: 400 })
  }
}
