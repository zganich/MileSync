#!/bin/bash

echo "🚀 MileSync Deployment Script"
echo "=============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up Supabase database at https://supabase.com"
echo "2. Add environment variables in Vercel dashboard:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Seed demo data: npm run db:seed"
echo ""
echo "🎯 Demo account: demo@milesync.com / demo123"
echo "📖 See DEPLOYMENT.md for detailed instructions"
