# PowerShell Dev Script for Local Stripe Testing
# =============================================
# Usage: Run this script in your project root (where package.json is)
#
# - Serves backend (Node.js) on port 8000
# - Serves frontend (public/) on port 3000
# - Exports Stripe keys for backend
# - Opens browser to http://localhost:3000
# - Works on Windows PowerShell

# === CONFIG SECTION ===
$FRONTEND_PORT = 3000
$BACKEND_PORT = 8000
$FRONTEND_DIR = "./public"
$STRIPE_MODE = "live" # change to "test" for test mode
$BROWSER_COMMAND = "start" # use "start" for Windows
# =======================

# Choose Stripe key
if ($STRIPE_MODE -eq "live") {
  $env:STRIPE_PUBLISHABLE_KEY = "pk_live_xxx"
  $env:STRIPE_SECRET_KEY = "sk_live_xxx"
} else {
  $env:STRIPE_PUBLISHABLE_KEY = "pk_test_xxx"
  $env:STRIPE_SECRET_KEY = "sk_test_xxx"
}

Write-Host "🌍 Starting local dev environment..."
Write-Host "📦 Stripe Mode: $STRIPE_MODE"
Write-Host "🔑 PUBLISHABLE: $env:STRIPE_PUBLISHABLE_KEY"

# Start backend (Node.js server.js) on port 8000
Write-Host "🚀 Launching backend on port $BACKEND_PORT..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" # Assumes 'dev' script runs nodemon server.js
Start-Sleep -Seconds 2

# Start frontend server (public/) on port 3000
Write-Host "🖥️  Serving frontend from $FRONTEND_DIR on http://localhost:$FRONTEND_PORT..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx serve $FRONTEND_DIR -l $FRONTEND_PORT"
Start-Sleep -Seconds 1

# Open browser
Invoke-Expression "$BROWSER_COMMAND http://localhost:$FRONTEND_PORT"

# Wait for user to close
Write-Host "Press Enter to exit and stop all dev servers..."
[void][System.Console]::ReadLine()

# Optionally, kill all started processes (if needed)
# Stop-Process -Name node -Force
# Stop-Process -Name serve -Force 