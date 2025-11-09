#!/bin/bash

echo "🎵 YouTube Playlist Downloader & Player - Development Mode"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating server .env file..."
    cp server/.env.example server/.env
fi

if [ ! -f client/.env ]; then
    echo "📝 Creating client .env file..."
    cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
EOF
fi

# Install dependencies
echo "📦 Installing server dependencies..."
cd server && npm install
cd ..

echo "📦 Installing client dependencies..."
cd client && npm install
cd ..

echo "🚀 Starting development servers..."

# Start server in background
cd server
node server.js &
SERVER_PID=$!
cd ..

# Start client (this will be in foreground)
cd client
npm start &
CLIENT_PID=$!
cd ..

echo "✅ Development servers started!"
echo "🖥️  Server PID: $SERVER_PID"
echo "🌐 Client PID: $CLIENT_PID"
echo ""
echo "Server: http://localhost:3001"
echo "Client: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait
