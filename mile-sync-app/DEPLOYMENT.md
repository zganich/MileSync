# MileSync Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Vercel account (free)
- Supabase account (free)
- Git repository

### Step 1: Set up Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Get Database Credentials**
   - Go to Settings > Database
   - Copy the connection string
   - Copy the anon key

### Step 2: Deploy to Vercel

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   cd mile-sync-app
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard**
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Step 3: Initialize Database

1. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

2. **Seed Demo Data**
   ```bash
   npm run db:seed
   ```

## 🔧 Environment Variables Reference

### Required for Production:
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Secure JWT signing key (generate with: `openssl rand -base64 32`)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### Optional:
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `MAX_FILE_SIZE` - Max upload size (default: 10MB)

## 🎯 Demo Account
- **Email**: demo@milesync.com
- **Password**: demo123

## 📱 Features Ready for Production

✅ **Authentication System**
- User registration and login
- JWT token-based security
- Password hashing

✅ **Dashboard**
- Real-time mileage statistics
- Trip history display
- Gap detection visualization

✅ **Trip Management**
- Add/edit/delete trips
- Business vs personal tracking
- Location and notes support

✅ **PDF Processing**
- Upload and process PDF documents
- Extract mileage data
- Automatic trip creation

✅ **Gap Detection**
- Identify missing mileage
- Visual gap indicators
- Resolution tracking

## 🚀 Production Checklist

- [ ] Supabase database configured
- [ ] Environment variables set in Vercel
- [ ] Domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Database migrations run
- [ ] Demo data seeded
- [ ] Application tested end-to-end

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check Supabase project is active
   - Ensure database is not paused

2. **Authentication Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings
   - Clear browser localStorage if needed

3. **File Upload Issues**
   - Check `MAX_FILE_SIZE` setting
   - Verify file type restrictions
   - Check Vercel function timeout limits

## 📞 Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check Supabase dashboard for database issues

---

**🎉 Your MileSync app is ready to ship!**
