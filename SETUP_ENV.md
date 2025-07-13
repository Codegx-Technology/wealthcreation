# Environment Variables Setup

## For Local Development

1. Create a `.env` file in the `wealthcreation` directory:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NODE_ENV=development
   PORT=3000
   ```

## For Netlify Deployment

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add the following variables:

### Production Environment
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: `sk_test_your_key_here` (or live key for production)
- **Scope**: All contexts (Production, Deploy previews, Branch deploys)

- **Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: `whsec_your_webhook_secret_here`
- **Scope**: All contexts

- **Name**: `NODE_ENV`
- **Value**: `production`
- **Scope**: All contexts

## Getting Your Stripe Keys

### 1. Stripe Secret Key
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign in to your account (or create one if you don't have one)
3. Go to **Developers** → **API Keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
5. **Copy the Secret key** - this is your `STRIPE_SECRET_KEY`

### 2. Stripe Webhook Secret
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Set the endpoint URL to: `https://your-netlify-site.netlify.app/.netlify/functions/index`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** - this is your `STRIPE_WEBHOOK_SECRET`

## Important Notes

- **Never commit API keys** to your repository
- **Use test keys** for development and testing
- **Use live keys** only for production
- **Redeploy** after adding environment variables
- **Test thoroughly** after setting up Stripe

## Testing Without Stripe

Your app will work perfectly without Stripe keys initially. Payment features will show appropriate "temporarily unavailable" messages until you configure Stripe. 