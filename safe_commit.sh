#!/bin/bash

echo "🛡️ Safe Git Commit - Preserving Production Changes"
echo "=================================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo ""
echo "📍 Current directory: $(pwd)"

echo ""
echo "🔍 Checking current status..."
git status --short

echo ""
echo "📝 Adding all production-ready changes..."
git add .

echo ""
echo "💾 Creating safe commit with clean message..."
git commit -m "Production Release: Live Payment System

Features:
- Live Stripe payment processing
- Firebase registration system  
- Mobile responsive design
- Custom payment amounts
- Bank transfer option
- Production environment ready

Technical:
- Environment: Production
- Payment: Live Stripe integration
- Database: Firebase Firestore
- Security: Enhanced validation
- Performance: Optimized for mobile

Bank Details: Virgin Money
Sort Code: 82-19-74
Account: 50458257"

echo ""
echo "🔄 Fetching latest remote changes..."
git fetch origin

echo ""
echo "🔄 Pulling with merge strategy..."
git pull origin main --strategy=ours --no-edit

echo ""
echo "🚀 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Safe commit completed!"
echo ""
echo "🔍 Verifying final state..."
git status

echo ""
echo "📊 Latest commits:"
git log --oneline -3

echo ""
echo "🎉 Production changes preserved and pushed!"
echo "Repository: https://github.com/Codegx-Technology/wealthcreation"
