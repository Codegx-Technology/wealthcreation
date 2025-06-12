#!/bin/bash

echo "🏦 COMMITTING PAYMENT DETAILS VISIBILITY FIXES"
echo "=============================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo "📍 Working in: $(pwd)"

# Step 1: Add all changes
echo ""
echo "📝 Step 1: Adding all changes..."
git add .

# Step 2: Commit with detailed message
echo ""
echo "💾 Step 2: Committing payment details visibility fixes..."
git commit -m "Fix: Payment details background and text contrast for Virgin Money bank details

🏦 PAYMENT DETAILS FIXES:
- Changed background from dark to light for better readability
- Updated text colors from white to dark for better contrast
- Enhanced Virgin Money bank details visibility
- Improved mobile responsiveness for payment info section

🎨 VISUAL IMPROVEMENTS:
- Light background: rgba(255, 255, 255, 0.95) instead of dark overlay
- Dark text: var(--primary) color for excellent contrast
- Highlighted bank details: Gold background boxes for values
- Monospace font for bank numbers (better readability)
- Enhanced visual hierarchy with proper spacing

📱 MOBILE OPTIMIZATIONS:
- Centered payment info header on mobile
- Single column layout for bank details on mobile
- Better padding and spacing for mobile screens
- Improved touch targets and readability

🔧 TECHNICAL CHANGES:
- Updated .payment-info background gradient
- Changed .payment-info-title color to var(--primary)
- Enhanced .detail-value styling with background boxes
- Removed text shadows for cleaner appearance
- Added mobile-specific CSS improvements

✅ ACCESSIBILITY IMPROVEMENTS:
- Better color contrast ratio for text readability
- Enhanced visual hierarchy for bank details
- Improved mobile user experience
- Clearer distinction between labels and values

🏦 BANK DETAILS ENHANCED:
- Virgin Money bank name clearly visible
- Sort Code: 82-19-74 in highlighted box
- Account Number: 50458257 in highlighted box
- Better visual separation and readability

This ensures the Virgin Money bank transfer details are clearly
visible and easy to read on all devices with excellent contrast."

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
git merge main --no-ff -m "Sync: Payment details visibility and contrast fixes"
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
echo "🎉 SUCCESS! Payment details visibility fixes committed and pushed"
echo "🔗 Repository: https://github.com/Codegx-Technology/wealthcreation"
echo ""
echo "🧪 TESTING:"
echo "✅ Open payment_details_test.html to compare old vs new"
echo "✅ Open index.html to verify Virgin Money details visibility"
echo "✅ Test on mobile device for mobile optimizations"
echo ""
echo "🏦 VIRGIN MONEY DETAILS NOW CLEARLY VISIBLE:"
echo "✅ Bank Name: Virgin Money"
echo "✅ Sort Code: 82-19-74"
echo "✅ Account Number: 50458257"
echo "✅ Light background with dark text for excellent contrast"
echo "✅ Highlighted boxes for easy copying"
echo ""
echo "🔧 FIXES APPLIED:"
echo "✅ Payment details background lightened"
echo "✅ Text contrast dramatically improved"
echo "✅ Mobile responsiveness enhanced"
echo "✅ Visual hierarchy optimized"
