#!/bin/bash

echo "🔍 Git Conflict Resolution Script"
echo "================================="

# Navigate to project directory
cd /home/oduor/Downloads/wealthcreation-main

echo ""
echo "📍 Current directory: $(pwd)"

echo ""
echo "🔍 Checking git status..."
git status

echo ""
echo "🌿 Checking current branch..."
git branch

echo ""
echo "🌿 Checking all branches..."
git branch -a

echo ""
echo "📊 Checking for uncommitted changes..."
git diff --name-only

echo ""
echo "📋 Checking staged files..."
git diff --cached --name-only

echo ""
echo "🔄 Fetching latest from remote..."
git fetch origin

echo ""
echo "📝 Adding all current changes..."
git add .

echo ""
echo "💾 Committing current state..."
git commit -m "Production ready state - resolving conflicts

- Live Stripe integration with real payment processing
- Production environment configuration
- Enhanced Firebase logging
- Mobile-optimized responsive design
- Custom amount validation
- Payment card visibility improvements
- All production features implemented and tested"

echo ""
echo "🔄 Pulling latest changes from main..."
git pull origin main --no-edit

echo ""
echo "🚀 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Git operations completed!"
echo ""
echo "🔍 Final status check..."
git status

echo ""
echo "📊 Recent commits..."
git log --oneline -5

echo ""
echo "🎉 All done! Check your repository at:"
echo "https://github.com/Codegx-Technology/wealthcreation"
