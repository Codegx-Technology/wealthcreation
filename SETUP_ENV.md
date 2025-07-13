# Environment Variables Setup

## For Local Development

1. Create a `.env` file in the `wealthcreation` directory:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NODE_ENV=development
   PORT=3000
   ```

## For Vercel Deployment

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:

### Production Environment
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: `sk_test_your_key_here` (or live key for production)
- **Environment**: Production

- **Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: `whsec_your_webhook_secret_here`
- **Environment**: Production

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production

### Preview Environment (Optional)
Add the same variables for Preview environment if you want to test deployments.

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers > API Keys
3. Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
4. For webhook secret, go to Developers > Webhooks
5. Create a webhook endpoint and copy the signing secret

## Security Notes

- Never commit `.env` files to Git
- Use test keys for development
- Use live keys only in production
- Keep your keys secure and rotate them regularly 