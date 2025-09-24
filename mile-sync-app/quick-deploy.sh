#!/bin/bash

echo "🚀 MileSync Quick Deploy Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this from the mile-sync-app directory"
    exit 1
fi

echo "✅ Found MileSync project"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 Vercel CLI ready"

# Create a simple deployment without login (will prompt for auth)
echo "🌐 Starting deployment..."
echo "📝 Note: You'll need to login to Vercel when prompted"
echo ""

# Try to deploy
vercel --prod --yes

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "🔧 Next steps:"
echo "1. Complete Vercel login in your browser"
echo "2. Set up Supabase database (see DEPLOY-NOW.md)"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Test your live app!"
echo ""
echo "📖 See DEPLOY-NOW.md for complete instructions"
