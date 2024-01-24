export default function StripeTestCards() {
  return (
    <div className='my-4 rounded-lg bg-red-200 p-4'>
      Use any of the{' '}
      <a
        className='underline'
        href='https://stripe.com/docs/testing#cards'
        target='_blank'
        rel='noopener noreferrer'
      >
        Stripe test cards
      </a>{' '}
      for this demo, e.g.{' '}
      <div className='mt-2 text-center'>
        4242<span className='mr-2'></span>4242<span className='mr-2'></span>4242
        <span className='mr-2'></span>4242
      </div>
    </div>
  )
}
