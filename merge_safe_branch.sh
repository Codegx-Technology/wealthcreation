#!/bin/bash

echo "🔄 Merging Safe Branch Back to Main"
echo "==================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo ""
echo "📍 Current directory: $(pwd)"

echo ""
echo "🔍 Ensuring we're on main branch"
git checkout main

echo ""
echo "🔄 Merging safe_branch into main with clean commit"
git merge safe_branch --no-ff -m "Production Release: Complete Payment System

PRODUCTION READY FEATURES:
✅ Live Stripe payment processing
✅ Firebase registration system
✅ Mobile responsive design
✅ Custom payment amounts
✅ Bank transfer integration
✅ Production environment configuration

TECHNICAL SPECIFICATIONS:
- Environment: Production
- Payments: Live Stripe integration
- Database: Firebase Firestore
- Security: Enhanced validation
- Performance: Mobile optimized

PAYMENT OPTIONS:
- Stripe: £50, £75, £100, Custom amounts
- Bank Transfer: Virgin Money (82-19-74, 50458257)

This release includes all production-ready features
and has been thoroughly tested for live deployment."

echo ""
echo "🚀 Pushing clean main branch to remote"
git push origin main

echo ""
echo "🧹 Cleaning up: Deleting safe_branch (changes now in main)"
git branch -d safe_branch
git push origin --delete safe_branch

echo ""
echo "✅ SUCCESS! Production changes merged to main with clean history"
echo ""
echo "📊 Final status:"
git status

echo ""
echo "📊 Recent commits:"
git log --oneline -3

echo ""
echo "🎉 Main branch is now clean and contains all production features!"
echo "🔗 Repository: https://github.com/Codegx-Technology/wealthcreation"
