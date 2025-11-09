#!/bin/bash

echo "🎵 YouTube Playlist Downloader & Player - Starting..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
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

echo "🚀 Starting services with Docker Compose..."
docker-compose up --build

echo "✅ Services are running!"
echo "🌐 Open http://localhost:3000 in your browser"
