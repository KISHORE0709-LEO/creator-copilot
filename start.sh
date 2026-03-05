#!/bin/bash

echo "🚀 Starting Creator Copilot..."
echo ""
echo "Backend API: http://localhost:3001"
echo "Frontend: http://localhost:8080"
echo ""

# Start backend server in background
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
npm run client

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
