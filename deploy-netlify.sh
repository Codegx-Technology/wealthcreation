#!/bin/bash

# Netlify Deployment Script for Wealth Creation Registration

echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=public

echo "✅ Deployment completed!"
echo "📋 Next steps:"
echo "1. Set up environment variables in Netlify dashboard"
echo "2. Test the registration form"
echo "3. Test Stripe payments (when configured)"
echo "4. Configure custom domain if needed" 