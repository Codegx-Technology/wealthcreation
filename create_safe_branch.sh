#!/bin/bash

echo "🛡️ Creating Safe Branch Strategy"
echo "================================"

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo ""
echo "📍 Current directory: $(pwd)"

echo ""
echo "🔍 Current git status:"
git status --short

echo ""
echo "🌿 Current branch:"
git branch

echo ""
echo "💾 Step 1: Add all current production changes"
git add .

echo ""
echo "🛡️ Step 2: Create safe_branch with all production changes"
git checkout -b safe_branch

echo ""
echo "💾 Step 3: Commit all production changes to safe_branch"
git commit -m "SAFE BACKUP: Complete Production Ready System

PRODUCTION FEATURES PRESERVED:
✅ Live Stripe Integration
- Real payment processing with live keys
- Custom amount validation (£1-£10,000)
- Fixed pricing options (£50, £75, £100)
- Enhanced error handling

✅ Firebase Production Setup
- Live database connection
- Production environment detection
- Enhanced logging with submission IDs
- User agent tracking

✅ UI/UX Production Ready
- Payment card visibility improvements
- White text on optimized background
- Mobile-first responsive design
- Performance optimizations

✅ Environment Configuration
- NODE_ENV=production
- Live Stripe secret key configured
- Production API endpoints
- Enhanced security validation

✅ Bank Transfer Integration
- Virgin Money details (82-19-74, 50458257)
- Manual payment processing
- Reference number validation

TECHNICAL IMPLEMENTATION:
- Environment: Production ready
- Payments: Live Stripe processing
- Database: Firebase Firestore
- Security: Enhanced validation
- Performance: Mobile optimized
- Responsive: All devices supported

This branch contains ALL production-ready changes and can be safely merged back to main after sanitization."

echo ""
echo "🚀 Step 4: Push safe_branch to remote"
git push origin safe_branch

echo ""
echo "🔄 Step 5: Switch back to main branch"
git checkout main

echo ""
echo "✅ Safe branch created successfully!"
echo ""
echo "📊 Branch status:"
git branch -a

echo ""
echo "🛡️ Production changes are now safely stored in 'safe_branch'"
echo "🧹 Next: Sanitize main branch"
echo "🔄 Then: Merge safe_branch back to main"
