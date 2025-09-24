# Production Debugging Guide

## Issues Identified and Fixed

### 1. API Configuration Mismatch
**Problem**: API base URL inconsistency between `services/api.ts` and `next.config.js`
- `services/api.ts` was configured for `http://localhost:3000`
- `next.config.js` rewrites were pointing to `http://localhost:3001`

**Solution**: Updated `next.config.js` to use consistent port 3000
```javascript
// next.config.js
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
      },
    ];
  },
}
```

### 2. Dynamic Server Usage Errors
**Problem**: Next.js build errors for API routes using `request.headers`
```
Route /api/mileage/gaps couldn't be rendered statically because it used `request.headers`
```

**Solution**: Added `export const dynamic = 'force-dynamic'` to affected API routes:
- `/api/auth/me/route.ts`
- `/api/mileage/gaps/route.ts`
- `/api/mileage/summary/route.ts`
- `/api/mileage/trips/route.ts`

### 3. Environment Variables
**Problem**: Missing `NEXT_PUBLIC_API_URL` environment variable
**Solution**: Added to environment configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Files Modified

### Configuration Files
- `frontend/next.config.js` - Fixed API URL consistency
- `frontend/services/api.ts` - Already had correct base URL

### API Routes
- `frontend/app/api/auth/me/route.ts` - Added dynamic export
- `frontend/app/api/mileage/gaps/route.ts` - Added dynamic export
- `frontend/app/api/mileage/summary/route.ts` - Added dynamic export
- `frontend/app/api/mileage/trips/route.ts` - Added dynamic export

### Documentation
- `README.md` - Added troubleshooting section and development guidelines
- `DEPLOYMENT.md` - Enhanced troubleshooting section
- `docs/technical/production-debugging.md` - This file

## Build Verification

After fixes, the build now completes successfully:
```bash
npm run build
✓ Compiled successfully
✓ Linting and checking validity of types    
✓ Collecting page data    
✓ Generating static pages (6/6)
✓ Collecting build traces    
✓ Finalizing page optimization    
```

## Prevention

To prevent similar issues in the future:
1. Always test builds locally before deployment
2. Ensure environment variables are consistent across all configuration files
3. Add `export const dynamic = 'force-dynamic'` to any API route that uses request headers
4. Update documentation when making configuration changes
5. Keep README.md and TODO files current with all changes

## Testing Checklist

- [ ] Local build succeeds without errors
- [ ] API routes respond correctly
- [ ] Authentication flow works
- [ ] Environment variables are properly set
- [ ] Documentation is updated
