# PowerShell Dev Script for Local Stripe Testing
# =============================================
# Usage: Run this script in your project root (where package.json is)
# - Starts backend (Node.js/Express) with pm2 (auto-restarts on changes)
# - Opens browser to http://localhost:3000
# - Works on Windows PowerShell

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js to continue."
    exit 1
}

# Check for npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not installed. Please install npm to continue."
    exit 1
}

# Check for pm2, install if missing
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "Installing pm2 globally..."
    npm install -g pm2
} else {
    Write-Host "pm2 is already installed."
}

# Check if node_modules exists and is up to date
$packageLock = "package-lock.json"
$nodeModules = "node_modules"
$packageJson = "package.json"

$needInstall = $false
if (-not (Test-Path $nodeModules)) {
    $needInstall = $true
} elseif ((Test-Path $packageLock) -and ((Get-Item $packageLock).LastWriteTime -gt (Get-Item $nodeModules).LastWriteTime)) {
    $needInstall = $true
} elseif ((Test-Path $packageJson) -and ((Get-Item $packageJson).LastWriteTime -gt (Get-Item $nodeModules).LastWriteTime)) {
    $needInstall = $true
}

if ($needInstall) {
    Write-Host "Installing/updating npm dependencies..."
    npm install
} else {
    Write-Host "Dependencies are up to date."
}

# Stop any previous pm2 instance
pm2 delete wealth-server 2>$null

# Start the server with pm2 in watch mode (auto-restart on changes)
Write-Host "Starting server with pm2 (watch mode enabled)..."
pm2 start server.js --name wealth-server --watch

# Open the browser ONCE to the app (optional, safe for Windows)
Start-Process "http://localhost:3000"

Write-Host "`nTo see logs: pm2 logs wealth-server"
Write-Host "To stop:    pm2 stop wealth-server"
Write-Host "To delete:  pm2 delete wealth-server"
Write-Host "To list:    pm2 list" 