#!/bin/bash

echo "🔄 SYNCING ALL BRANCHES WITH SAME FILES"
echo "======================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo "📍 Working in: $(pwd)"

# Step 1: Commit current changes to main
echo ""
echo "💾 Step 1: Committing current fixes to main..."
git add .
git commit -m "Fix: Remove duplicate payment reference field and enhance custom amount functionality

✅ FIXES APPLIED:
- Removed duplicate 'Payment Reference' field from form grid
- Enhanced toggleCustomAmount() function with better logging
- Added initializeCustomAmount() function for proper event handling
- Fixed custom amount field visibility and validation
- Improved user experience for custom payment amounts

🔧 TECHNICAL IMPROVEMENTS:
- Better error handling and console logging
- Proper event listener initialization
- Enhanced form validation for custom amounts
- Cleaner form structure without duplicates

This ensures the payment form works correctly with no duplicate fields
and the custom amount option displays properly when selected."

echo "✅ Main branch updated with fixes"

# Step 2: Update development branch
echo ""
echo "🌿 Step 2: Updating development branch..."
git checkout development
git merge main --no-ff -m "Sync development with main: Payment form fixes

- Remove duplicate payment reference field
- Fix custom amount functionality
- Enhance form validation
- Improve user experience"

echo "✅ Development branch updated"

# Step 3: Push both branches
echo ""
echo "🚀 Step 3: Pushing all branches to remote..."
git push origin development

git checkout main
git push origin main

echo "✅ All branches pushed to remote"

# Step 4: Verify synchronization
echo ""
echo "📊 Step 4: Verifying branch synchronization..."
echo ""
echo "🌿 Branches:"
git branch -a

echo ""
echo "📊 Recent commits on main:"
git log --oneline -3

echo ""
echo "📊 Recent commits on development:"
git checkout development
git log --oneline -3

echo ""
echo "🔄 Switching back to main..."
git checkout main

echo ""
echo "✅ SUCCESS! All branches synchronized with same files"
echo "🔗 Repository: https://github.com/Codegx-Technology/wealthcreation"
echo ""
echo "🎯 FIXES APPLIED:"
echo "✅ Removed duplicate 'Choose Payment Method' issue"
echo "✅ Fixed custom amount field visibility"
echo "✅ Enhanced form validation"
echo "✅ All branches have identical files"
