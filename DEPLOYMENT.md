# 🚀 MileSync Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Step 1: Set up Supabase Database
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings** → **Database** → **Connection string**
3. Copy the connection string (looks like: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`)

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import from GitHub: `jamesknight/MileSync`
4. Set **Root Directory** to `frontend`
5. Click **Deploy**

### Step 3: Configure Environment Variables
In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

```
DATABASE_URL=postgresql://postgres:[your-password]@db.[your-project].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Set up Database (First Time Only)
After deployment, run these commands locally:

```bash
cd frontend
vercel env pull .env.local
npm run db:migrate
npm run db:seed
```

### Step 5: Test Your App
- Visit your Vercel URL
- Login with: `demo@milesync.com` / `demo123`
- You should see the dashboard with demo trips and gaps!

## 🎉 You're Live!

Your MileSync app is now deployed and ready to use. The demo account has realistic gig driver data to show off the features.

## Troubleshooting

### Common Production Issues

#### API Configuration Issues
- **Problem**: API calls failing with 404 or connection errors
- **Solution**: Ensure `NEXT_PUBLIC_API_URL` is set correctly in environment variables
- **Check**: Verify `next.config.js` rewrites match your API base URL

#### Dynamic Server Usage Errors
- **Problem**: Build errors like "Route couldn't be rendered statically because it used `request.headers`"
- **Solution**: Add `export const dynamic = 'force-dynamic'` to API routes that use headers
- **Fixed Routes**: `/api/auth/me`, `/api/mileage/gaps`, `/api/mileage/summary`, `/api/mileage/trips`

#### Environment Variables
- **Problem**: Missing or incorrect environment variables
- **Solution**: Ensure all required variables are set in Vercel dashboard:
  - `DATABASE_URL` - Supabase connection string
  - `JWT_SECRET` - Secure JWT signing key
  - `JWT_EXPIRES_IN` - Token expiration (default: 7d)
  - `NEXT_PUBLIC_API_URL` - API base URL (should match your domain)

#### Database Connection
- **Problem**: Database errors or connection failures
- **Solution**: Verify Supabase connection string format and credentials
- **Check**: Test connection in Supabase dashboard

#### Authentication Issues
- **Problem**: Login/logout not working properly
- **Solution**: Check JWT_SECRET is set and consistent across deployments
- **Debug**: Check browser network tab for 401/403 errors

### Debugging Steps
1. Check Vercel function logs for any API errors
2. Verify environment variables in Vercel dashboard
3. Test API endpoints directly using curl or Postman
4. Check browser console for client-side errors
5. Ensure database migrations have been run
