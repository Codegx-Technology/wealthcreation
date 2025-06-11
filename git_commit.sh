#!/bin/bash

echo "🔍 Checking git status..."
git status

echo ""
echo "📝 Adding all files..."
git add .

echo ""
echo "📊 Checking what will be committed..."
git status --short

echo ""
echo "💾 Committing changes..."
git commit -m "🚀 PRODUCTION READY - Live Stripe & Firebase Integration

✅ PRODUCTION FEATURES:
- Live Stripe secret key configured and working
- NODE_ENV set to production
- Enhanced payment card visibility (white text on lighter background)
- Production environment detection
- Enhanced Firebase logging with submission tracking
- Real money processing enabled
- Custom amount validation
- Mobile-optimized responsive design

💳 STRIPE INTEGRATION:
- Live payment processing with real money deduction
- Custom amount option (£1-£10,000)
- Fixed amounts: £50, £75, £100
- Enhanced error handling and validation
- Production API endpoints

🔥 FIREBASE ENHANCEMENTS:
- Production metadata tracking
- Unique submission IDs
- Environment detection
- Enhanced logging and debugging
- User agent tracking for analytics

🎨 UI/UX IMPROVEMENTS:
- Payment card background optimized for readability
- White text with shadows on payment details
- Smooth animations without layout shifts
- Mobile-first responsive design
- Performance optimizations

⚠️ LIVE ENVIRONMENT:
- Real Stripe payments processing
- Production Firebase database
- Enhanced security and validation
- Ready for live customers

Bank Details: Virgin Money (82-19-74, 50458257)"

echo ""
echo "🚀 Pushing to remote..."
git push origin main

echo ""
echo "✅ Done! Check your remote repository."
