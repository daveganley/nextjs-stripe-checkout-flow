import { stripe } from '@/clients/stripe'
import type { Stripe } from 'stripe'
import { log } from '@/lib/logger'

export async function POST(req: Request) {
  // needs validation
  const { hash, email } = await req.json()

  try {
    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        customer_email: email,
        metadata: {
          hash,
        },
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'AUD',
              product_data: {
                name: 'Report', // change to match product name
              },
              unit_amount: 100 * 500,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/result?sid={CHECKOUT_SESSION_ID}`, // if you want the session ID you can add it like this
        cancel_url: `${req.headers.get('origin')}/`, // back the hash result page
      })

    return Response.json({ sessionId: session.id })
  } catch (error) {
    log(error)
    return Response.json(
      { error: 'Error creating checkout session' },
      { status: 400 }
    )
  }
}
