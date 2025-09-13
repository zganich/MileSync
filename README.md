# MileSync

A gig driver mileage reconciliation platform that simplifies mileage tracking and gap detection.

## Features

- **PDF Processing**: Automatically extract mileage data from uploaded PDF documents
- **Gap Detection**: Intelligent algorithm to identify missing mileage entries
- **Trip Management**: Add, edit, and track business and personal trips
- **Dashboard**: Comprehensive overview of mileage statistics and gaps
- **Authentication**: Secure user registration and login system
- **Simple UI**: Clean, intuitive interface following "grandma test" principles

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Vercel API Routes (Serverless Functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **PDF Processing**: pdf-parse, tesseract.js
- **Deployment**: Vercel (Full-Stack)

## Project Structure

```
MileSync/
├── app/                   # Next.js 14 App Router
│   ├── api/               # Vercel API Routes (Serverless Functions)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── mileage/       # Trip and gap management
│   │   └── upload/        # PDF processing endpoints
│   ├── components/        # React components
│   │   ├── auth/          # Login/Register forms
│   │   └── dashboard/     # Dashboard components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Context providers
├── lib/                   # Utility libraries
│   ├── db.ts              # Database connection (Drizzle + Supabase)
│   ├── schema.ts          # Database schema definitions
│   ├── migrate.ts         # Database migrations
│   └── demo-data.ts       # Demo data seeding
├── hooks/                 # Custom React hooks
├── services/              # API service functions
├── types/                 # TypeScript type definitions
├── package.json           # Dependencies
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Supabase account (free)
- Vercel account (free)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jamesknight/MileSync.git
   cd MileSync/frontend
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   
   **Environment Variables (.env.local in frontend/ folder):**
   ```env
   # Database Configuration (Supabase)
   DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # File Upload
   MAX_FILE_SIZE=10485760
   
   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   ```bash
   # 1. Create a new project at https://supabase.com
   # 2. Go to Settings > Database > Connection string
   # 3. Copy the connection string and add to .env.local
   # 4. Run migrations and seed data
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Application: http://localhost:3000
   - API: http://localhost:3000/api
   - Demo account: demo@milesync.com / demo123

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
```

## Deployment

### Deploy to Vercel (Full-Stack)

1. **Connect to Vercel**
   ```bash
   cd frontend
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables** in Vercel dashboard:
   - `DATABASE_URL` - Your Supabase connection string
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRES_IN` - Token expiration (default: 7d)

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set up database** (first deployment only):
   - Run migrations: `vercel env pull .env.local` then `npm run db:migrate`
   - Seed demo data: `npm run db:seed`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Mileage Management
- `GET /api/mileage/trips` - Get user trips
- `POST /api/mileage/trips` - Create new trip
- `PUT /api/mileage/trips/:id` - Update trip
- `DELETE /api/mileage/trips/:id` - Delete trip
- `GET /api/mileage/summary` - Get mileage summary

### Gap Detection
- `GET /api/mileage/gaps` - Get mileage gaps
- `POST /api/mileage/gaps/detect` - Trigger gap detection
- `PUT /api/mileage/gaps/:id/resolve` - Resolve gap

### File Upload
- `POST /api/upload/pdf` - Upload and process PDF
- `GET /api/upload/files` - Get uploaded files
- `DELETE /api/upload/files/:filename` - Delete file

## Core Features

### PDF Processing
- Extracts mileage data from uploaded PDF documents
- Supports various PDF formats and layouts
- Validates extracted data for accuracy
- Automatically creates trip entries

### Gap Detection Algorithm
- **Date Gaps**: Identifies missing days between trips
- **Mileage Inconsistencies**: Detects mismatched odometer readings
- **Odometer Rollover**: Handles odometer reset scenarios
- **Unusual Patterns**: Flags abnormally high daily mileage

### Trip Management
- Manual trip entry with validation
- Business vs personal mileage tracking
- Location and notes support
- Trip verification system

## Development Guidelines

- The AI assistant has full permission to make changes, add features, and implement functionality without asking for permission
- All development tasks including software development, infrastructure design, reading files, making changes, and applying code fixes are within scope
- Changes will be made directly to implement the core functionality as needed
- **Always save changes after each update** - this ensures all modifications are preserved
- Follow "grandma test" principles for extreme simplicity in UI/UX
- Use TypeScript for type safety
- Follow RESTful API conventions
- Implement proper error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
