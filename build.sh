#!/bin/bash
set -e

echo "🔧 Starting build process..."

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build command
echo "🏗️ Running build..."
npm run build

echo "✅ Build completed successfully!"
