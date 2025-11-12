#!/bin/bash

# Start script for ListApp
# Starts both mock server and app in separate terminal tabs

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting ListApp..."
echo ""
echo "Opening mock server in new tab..."

# Open new terminal tab for mock server
osascript <<EOF
tell application "Terminal"
    activate
    tell application "System Events" to keystroke "t" using {command down}
    delay 0.5
    do script "cd '$PROJECT_DIR/mock-server' && npm start" in front window
end tell
EOF

sleep 1

echo "Opening app in new tab..."

# Open new terminal tab for the app
osascript <<EOF
tell application "Terminal"
    tell application "System Events" to keystroke "t" using {command down}
    delay 0.5
    do script "cd '$PROJECT_DIR' && npm start" in front window
end tell
EOF

echo ""
echo "✓ Started!"
echo ""
echo "Two new terminal tabs opened:"
echo "  1. Mock GraphQL server (port 9002)"
echo "  2. Expo dev server"
echo ""
echo "Once Expo starts, press 'i' for iOS or 'a' for Android"
echo ""
