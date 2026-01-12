#!/bin/bash

echo "🌸 Starting Resume Blossom Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo "Open http://localhost:3000 in your browser"
echo ""

npm run dev
