#!/bin/bash

# MHCQMS Frontend Deployment Script
# This script helps you deploy your frontend to Render

echo "🎨 MHCQMS Frontend Deployment Script"
echo "===================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "🔍 Checking dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🏗️  Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Static Site'"
echo "3. Connect your GitHub repository"
echo "4. Select the MHCQMS repository"
echo "5. Set Root Directory to 'frontend'"
echo "6. Set Build Command to 'npm install && npm run build'"
echo "7. Set Publish Directory to 'dist'"
echo "8. Add environment variable: VITE_API_URL=https://mhcqms-backend.onrender.com/api/v1"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for complete instructions"
echo ""
echo "🌐 Your frontend will be available at: https://your-site-name.onrender.com"
