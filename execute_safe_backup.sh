#!/bin/bash
set -e  # Exit on any error

echo "🛡️ EXECUTING SAFE BACKUP NOW"
echo "============================="

# Ensure we're in the right directory
cd /home/oduor/Downloads/wealthcreation-main || {
    echo "❌ Could not find project directory"
    exit 1
}

echo "📍 Working in: $(pwd)"

# Step 1: Add all production changes
echo ""
echo "📝 Step 1: Adding all production changes..."
git add . || {
    echo "❌ Failed to add files"
    exit 1
}

echo "✅ All files added"

# Step 2: Create safe_branch
echo ""
echo "🛡️ Step 2: Creating safe_branch..."
git checkout -b safe_branch || {
    echo "❌ Failed to create safe_branch"
    exit 1
}

echo "✅ safe_branch created"

# Step 3: Commit all production changes
echo ""
echo "💾 Step 3: Committing production changes..."
git commit -m "PRODUCTION BACKUP: Complete Live Payment System

LIVE FEATURES PRESERVED:
✅ Stripe Live Keys: sk_live_51RSwMYHJXlyttSrE... (WORKING)
✅ Production Environment: NODE_ENV=production  
✅ Live Payment Processing: Real money transactions
✅ Custom Amount Validation: £1-£10,000
✅ Mobile Responsive Design: All devices optimized
✅ Firebase Live Integration: Production database
✅ Payment Card Improvements: White text visibility
✅ Bank Transfer: Virgin Money (82-19-74, 50458257)

TECHNICAL STACK:
- Environment: Production ready
- Payments: Live Stripe integration  
- Database: Firebase Firestore
- Security: Enhanced validation
- Performance: Mobile optimized

This branch contains ALL working production features." || {
    echo "❌ Failed to commit"
    exit 1
}

echo "✅ Production changes committed to safe_branch"

# Step 4: Push safe_branch to remote
echo ""
echo "🚀 Step 4: Pushing safe_branch to remote..."
git push origin safe_branch || {
    echo "❌ Failed to push safe_branch"
    exit 1
}

echo "✅ safe_branch pushed to remote"

# Step 5: Switch back to main
echo ""
echo "🔄 Step 5: Switching back to main..."
git checkout main || {
    echo "❌ Failed to switch to main"
    exit 1
}

echo "✅ Switched to main branch"

echo ""
echo "🎉 SUCCESS! Production changes safely backed up in safe_branch"
echo "📊 Current branches:"
git branch -a

echo ""
echo "🛡️ PRODUCTION CHANGES ARE SAFE!"
echo "✅ safe_branch contains all live Stripe integration"
echo "✅ safe_branch contains production environment"
echo "✅ safe_branch contains mobile optimizations"
echo "✅ safe_branch contains Firebase enhancements"
echo ""
echo "🔄 Ready for main branch sanitization and merge back"
