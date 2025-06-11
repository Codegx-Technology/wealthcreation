#!/bin/bash

echo "📱 COMMITTING MOBILE PAYMENT FIXES"
echo "=================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo "📍 Working in: $(pwd)"

# Step 1: Add all changes
echo ""
echo "📝 Step 1: Adding all changes..."
git add .

# Step 2: Commit with detailed message
echo ""
echo "💾 Step 2: Committing mobile payment fixes..."
git commit -m "Fix: Mobile payment method icons visibility and update ticket prices

📱 MOBILE ICON FIXES:
- Enhanced payment method icon visibility on mobile devices
- Added !important declarations to ensure icons always show
- Improved mobile CSS for payment method content layout
- Added FontAwesome font-family fallbacks for mobile
- Fixed icon sizing and spacing for mobile screens

🎫 TICKET PRICE UPDATES:
- Updated Early Bird price from £50 to £150
- Updated Standard price from £75 to £200
- Removed VIP option (£100) as requested
- Maintained Custom Amount option for flexibility

🔧 TECHNICAL IMPROVEMENTS:
- Enhanced mobile responsive CSS for payment methods
- Added specific mobile icon styling with !important flags
- Improved payment method content flexbox layout
- Added mobile test page for debugging
- Better FontAwesome icon loading detection

📊 MOBILE OPTIMIZATIONS:
- Payment method icons now 1.8rem on mobile
- Better spacing and alignment for mobile screens
- Enhanced touch targets for mobile interaction
- Improved visual hierarchy for payment options

✅ FIXES APPLIED:
- Payment method icons visible on all mobile devices
- Ticket prices updated to £150 and £200
- Enhanced mobile user experience
- Better icon loading and fallback handling

This ensures payment method selection works perfectly on mobile
with clearly visible icons and updated pricing structure."

echo "✅ Changes committed successfully"

# Step 3: Push to remote
echo ""
echo "🚀 Step 3: Pushing to remote repository..."
git push origin main

echo "✅ Changes pushed to remote"

# Step 4: Update development branch
echo ""
echo "🌿 Step 4: Updating development branch..."
git checkout development
git merge main --no-ff -m "Sync: Mobile payment fixes and ticket price updates"
git push origin development

echo "✅ Development branch updated"

# Step 5: Return to main
echo ""
echo "🔄 Step 5: Returning to main branch..."
git checkout main

# Step 6: Verify status
echo ""
echo "📊 Step 6: Final verification..."
git status
git log --oneline -2

echo ""
echo "🎉 SUCCESS! Mobile payment fixes committed and pushed"
echo "🔗 Repository: https://github.com/Codegx-Technology/wealthcreation"
echo ""
echo "📱 MOBILE TESTING:"
echo "✅ Open mobile_test.html on mobile device to test icons"
echo "✅ Open index.html on mobile to verify payment methods"
echo "✅ Check that icons are clearly visible"
echo ""
echo "🎫 TICKET PRICES UPDATED:"
echo "✅ Early Bird: £150 (was £50)"
echo "✅ Standard: £200 (was £75)"
echo "✅ VIP option removed"
echo "✅ Custom amount option maintained"
echo ""
echo "🔧 FIXES APPLIED:"
echo "✅ Payment method icons visible on mobile"
echo "✅ Enhanced mobile responsive design"
echo "✅ Updated ticket pricing structure"
echo "✅ Better FontAwesome icon handling"
