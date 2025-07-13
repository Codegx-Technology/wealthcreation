# 🚀 Netlify Deployment Guide

This guide will help you deploy the Wealth Creation Registration app to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://netlify.com)
2. Stripe account with API keys (optional for initial deployment)
3. Git repository with your code

## Environment Variables Setup

Before deploying, you need to set up the following environment variables in your Netlify project:

### Required Environment Variables

1. **STRIPE_SECRET_KEY**
   - Your Stripe secret key (starts with `sk_test_` for test mode or `sk_live_` for live mode)
   - Get this from your Stripe Dashboard > Developers > API Keys

2. **STRIPE_WEBHOOK_SECRET** (Optional but recommended)
   - Your Stripe webhook endpoint secret
   - Get this from your Stripe Dashboard > Developers > Webhooks

3. **NODE_ENV**
   - Set to `production` for live deployment

### How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"**
5. Add each variable:
   - **Key**: `STRIPE_SECRET_KEY`
   - **Value**: `sk_test_your_stripe_secret_key_here`
   - **Scope**: All contexts (Production, Deploy previews, Branch deploys)

## Deployment Steps

### Method 1: Deploy from Git (Recommended)

1. **Connect to Git**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click **"New site from Git"**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
   - **Base directory**: Leave empty (if your code is in the root)

3. **Deploy**
   - Click **"Deploy site"**
   - Netlify will automatically build and deploy your site

### Method 2: Manual Deploy

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop your `public` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=public
   ```

## Post-Deployment Setup

### 1. Set Environment Variables
- Go to your site's **Site settings** → **Environment variables**
- Add the required environment variables listed above

### 2. Configure Custom Domain (Optional)
- Go to **Domain settings**
- Add your custom domain
- Configure DNS settings as instructed

### 3. Test Your Application
- Test the registration form
- Test payment processing (if Stripe is configured)
- Test all form validations

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (18.x recommended)

2. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check variable names are exactly correct
   - Ensure variables are set for the correct context

3. **API Functions Not Working**
   - Check that `api/index.js` exists
   - Verify `netlify.toml` configuration
   - Check function logs in Netlify dashboard

### Getting Help

- Check Netlify's [documentation](https://docs.netlify.com/)
- View build logs in your Netlify dashboard
- Check function logs for serverless function issues

## Next Steps After Deployment

1. **Test the registration form**
2. **Configure Stripe webhooks** (when ready)
3. **Set up custom domain** (if needed)
4. **Monitor site performance** using Netlify analytics
5. **Set up form notifications** in Netlify dashboard

## Security Considerations

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Enable HTTPS (automatic with Netlify)
- Consider setting up form spam protection

---

**Need help?** Check the Netlify documentation or contact support through your Netlify dashboard. 