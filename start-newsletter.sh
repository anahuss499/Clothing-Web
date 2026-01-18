#!/bin/bash

echo "🚀 Starting The Believers Newsletter Service..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your SendGrid credentials."
    echo ""
    echo "Next steps:"
    echo "1. Get a SendGrid API key from https://sendgrid.com/"
    echo "2. Edit .env and add your SENDGRID_API_KEY and SENDER_EMAIL"
    echo "3. Run this script again"
    exit 0
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "✅ Starting server..."
echo "📧 Newsletter service will be available at http://localhost:3000"
echo "🌐 Make sure your website is accessible to test the newsletter form"
echo ""
npm start
