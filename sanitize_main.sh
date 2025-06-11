#!/bin/bash

echo "🧹 Sanitizing Main Branch"
echo "========================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo ""
echo "📍 Current directory: $(pwd)"

echo ""
echo "🔍 Ensuring we're on main branch"
git checkout main

echo ""
echo "🔄 Fetching latest from remote"
git fetch origin

echo ""
echo "🧹 Resetting main to clean state"
# Reset to last known good commit or remote main
git reset --hard origin/main

echo ""
echo "🔍 Checking for any problematic commits"
echo "Recent commits on main:"
git log --oneline -5

echo ""
echo "✅ Main branch sanitized!"
echo ""
echo "📊 Current status:"
git status

echo ""
echo "🛡️ Safe branch still contains all production changes"
echo "🔄 Ready to merge safe_branch back to main"
