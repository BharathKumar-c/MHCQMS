#!/bin/bash

# MHCQMS Render Deployment Script
# This script helps you deploy your application to Render

echo "🚀 MHCQMS Render Deployment Script"
echo "=================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please navigate to your MHCQMS project directory."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes."
    read -p "Do you want to commit them before deploying? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
    fi
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo "❌ No remote origin found. Please add your GitHub repository as origin."
    echo "Example: git remote add origin https://github.com/username/MHCQMS.git"
    exit 1
fi

# Get remote URL
REMOTE_URL=$(git remote get-url origin)
echo "🔗 Remote repository: $REMOTE_URL"

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to remote repository"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://dashboard.render.com"
    echo "2. Create a new Web Service for backend"
    echo "3. Create a new Static Site for frontend"
    echo "4. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
    echo ""
    echo "🔑 Important Environment Variables for Backend:"
    echo "DATABASE_URL=postgres://avnadmin:YOUR_DATABASE_PASSWORD@pg-freedb-mhcqmsdb.d.aivencloud.com:28374/defaultdb?sslmode=require"
    echo "JWT_SECRET_KEY=your-super-secret-jwt-key-here"
    echo "ENVIRONMENT=production"
    echo "DEBUG=false"
    echo ""
    echo "🔑 Important Environment Variables for Frontend:"
    echo "VITE_API_URL=https://your-backend-service-name.onrender.com"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for complete instructions"
else
    echo "❌ Failed to push to remote repository"
    exit 1
fi
