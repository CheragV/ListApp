#!/bin/bash

# Setup script for ListApp
# Run this once to install all dependencies

set -e

echo "Setting up ListApp..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found. Install from nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ required. You have $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v)"

# Check for npm/yarn
if command -v npm &> /dev/null; then
    PKG_MGR="npm"
    echo "✓ npm $(npm -v)"
elif command -v yarn &> /dev/null; then
    PKG_MGR="yarn"
    echo "✓ yarn $(yarn -v)"
else
    echo "Error: npm or yarn not found"
    exit 1
fi

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "⚠ Xcode not found (needed for iOS)"
else
    echo "✓ Xcode installed"
fi

# Check CocoaPods
if ! command -v pod &> /dev/null; then
    echo "⚠ Installing CocoaPods..."
    sudo gem install cocoapods
else
    echo "✓ CocoaPods $(pod --version)"
fi

echo ""
echo "Installing app dependencies..."
if [ "$PKG_MGR" = "npm" ]; then
    npm install --legacy-peer-deps
else
    yarn install
fi

echo ""
echo "Installing mock server dependencies..."
cd mock-server

# Clean any corrupted node_modules
if [ -d "node_modules" ]; then
    echo "Cleaning existing mock server node_modules..."
    rm -rf node_modules package-lock.json
fi

if [ "$PKG_MGR" = "npm" ]; then
    npm install --legacy-peer-deps
else
    yarn install
fi
cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the app, run:"
echo "  bash start.sh"
echo ""
