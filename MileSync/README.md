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
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **PDF Processing**: pdf-parse, tesseract.js
- **Deployment**: Vercel (preferred)

## Project Structure

```
MileSync/
├── src/                    # Frontend source code (Next.js)
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── types/             # TypeScript type definitions
├── backend/               # Backend API
│   ├── config/            # Database and logger configuration
│   ├── middleware/        # Express middleware (auth, error handling)
│   ├── models/            # Sequelize data models
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic (PDF processing, gap detection)
│   └── server.js          # Main server file
├── database/              # Database related files
│   ├── migrations/        # Database migrations
│   └── seeds/             # Database seed files
├── uploads/               # File upload directory
├── logs/                  # Application logs
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jamesknight/MileSync.git
   cd MileSync
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd src
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/milesync
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=milesync
   DB_USER=your_username
   DB_PASSWORD=your_password
   
   # API Configuration
   API_PORT=3001
   API_URL=http://localhost:3001
   
   # Frontend Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=./uploads
   
   # Logging
   LOG_LEVEL=info
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb milesync
   
   # Run migrations
   npm run migrate
   
   # Seed with sample data (optional)
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run dev:backend
   
   # Frontend only (in src directory)
   cd src && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Demo account: demo@milesync.com / demo123

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

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Database
npm run migrate          # Run database migrations
npm run seed             # Seed database with sample data

# Production
npm run build            # Build for production
npm start                # Start production server
```

### Development Guidelines

- The AI assistant has full permission to make changes, add features, and implement functionality without asking for permission
- All development tasks including software development, infrastructure design, reading files, making changes, and applying code fixes are within scope
- Changes will be made directly to implement the core functionality as needed
- Follow "grandma test" principles for extreme simplicity in UI/UX
- Use TypeScript for type safety
- Follow RESTful API conventions
- Implement proper error handling and logging

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Database Setup (Production)

1. Set up PostgreSQL database (e.g., Supabase, Railway, or AWS RDS)
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npm run migrate`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
