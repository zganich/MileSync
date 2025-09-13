import { pgTable, uuid, varchar, timestamp, boolean, integer, text, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const purposeEnum = pgEnum('purpose', ['business', 'personal', 'mixed'])
export const sourceEnum = pgEnum('source', ['manual', 'pdf_upload', 'gps_tracking'])
export const statusEnum = pgEnum('status', ['pending', 'resolved', 'ignored'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Trips table
export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  startMileage: integer('start_mileage').notNull(),
  endMileage: integer('end_mileage').notNull(),
  totalMiles: integer('total_miles').notNull(),
  startLocation: varchar('start_location', { length: 255 }),
  endLocation: varchar('end_location', { length: 255 }),
  purpose: purposeEnum('purpose').notNull().default('business'),
  businessMiles: integer('business_miles'),
  personalMiles: integer('personal_miles'),
  notes: text('notes'),
  source: sourceEnum('source').notNull().default('manual'),
  sourceFile: varchar('source_file', { length: 255 }),
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// Mileage gaps table
export const mileageGaps = pgTable('mileage_gaps', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  gapType: varchar('gap_type', { length: 50 }).notNull(), // 'date_gap', 'mileage_inconsistency', 'unusual_pattern'
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  expectedMileage: integer('expected_mileage'),
  actualMileage: integer('actual_mileage'),
  missingMiles: integer('missing_miles'),
  description: text('description').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})
