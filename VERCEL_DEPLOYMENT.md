# Vercel Deployment Guide

This guide will help you deploy the Wealth Creation Registration app to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Stripe account with API keys
3. Git repository with your code

## Environment Variables Setup

Before deploying, you need to set up the following environment variables in your Vercel project:

### Required Environment Variables

1. **STRIPE_SECRET_KEY**
   - Your Stripe secret key (starts with `sk_test_` for test mode or `sk_live_` for live mode)
   - Get this from your Stripe Dashboard > Developers > API Keys

2. **STRIPE_WEBHOOK_SECRET** (Optional but recommended)
   - Your Stripe webhook endpoint secret
   - Get this from your Stripe Dashboard > Developers > Webhooks

3. **NODE_ENV**
   - Set to `production` for live deployment

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: `sk_test_your_key_here` (or live key)
   - **Environment**: Production (and Preview if needed)

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on every push to main branch

### Option 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure the project settings
4. Deploy

## Configuration Files

The project includes the following Vercel-specific files:

- `vercel.json` - Vercel configuration
- `package.json` - Updated with Vercel build scripts
- `env.example` - Example environment variables

## Post-Deployment

After deployment:

1. **Test the registration form** - Make sure all form fields work correctly
2. **Test Stripe payments** - Use test card numbers to verify payment processing
3. **Check webhook endpoints** - If using webhooks, update the endpoint URL in Stripe
4. **Monitor logs** - Check Vercel function logs for any errors

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure all required variables are set in Vercel dashboard
   - Check that variable names match exactly (case-sensitive)

2. **Stripe payments not working**
   - Verify your Stripe secret key is correct
   - Check that you're using the right key (test vs live)
   - Review Vercel function logs for errors

3. **Static files not loading**
   - Ensure all files are in the `public` directory
   - Check that file paths in HTML are correct

4. **CORS errors**
   - Update the CORS configuration in `server.js` to include your Vercel domain
   - Add your domain to the allowed origins list

### Getting Help

- Check Vercel function logs in the dashboard
- Review the server logs for detailed error messages
- Test locally first to ensure everything works

## Security Notes

- Never commit your `.env` file to Git
- Use test Stripe keys for development
- Only use live Stripe keys in production
- Regularly rotate your API keys

## Performance Optimization

- The app is configured for serverless deployment
- Static files are served efficiently
- API routes are optimized for Vercel's serverless functions 