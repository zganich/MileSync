import { db } from './db'
import { sql } from 'drizzle-orm'

export async function migrateDatabase() {
  try {
    console.log('🔄 Running database migrations...')

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create purpose enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE purpose AS ENUM ('business', 'personal', 'mixed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    // Create source enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE source AS ENUM ('manual', 'pdf_upload', 'gps_tracking');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    // Create status enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE status AS ENUM ('pending', 'resolved', 'ignored');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    // Create trips table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        start_mileage INTEGER NOT NULL,
        end_mileage INTEGER NOT NULL,
        total_miles INTEGER NOT NULL,
        start_location VARCHAR(255),
        end_location VARCHAR(255),
        purpose purpose NOT NULL DEFAULT 'business',
        business_miles INTEGER,
        personal_miles INTEGER,
        notes TEXT,
        source source NOT NULL DEFAULT 'manual',
        source_file VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create mileage_gaps table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS mileage_gaps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        gap_type VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        expected_mileage INTEGER,
        actual_mileage INTEGER,
        missing_miles INTEGER,
        description TEXT NOT NULL,
        status status NOT NULL DEFAULT 'pending',
        resolved_at TIMESTAMP,
        resolved_by UUID REFERENCES users(id),
        resolution_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_trips_user_start_date 
      ON trips(user_id, start_date)
    `)

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_trips_date_range 
      ON trips(start_date, end_date)
    `)

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_gaps_user_status 
      ON mileage_gaps(user_id, status)
    `)

    console.log('✅ Database migrations completed!')
  } catch (error) {
    console.error('❌ Migration error:', error)
    throw error
  }
}
