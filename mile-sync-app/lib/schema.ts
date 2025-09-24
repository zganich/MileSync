export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  passwordHash: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Trip {
  id: string
  userId: string
  date: string
  startOdometer: number
  endOdometer: number
  miles: number
  purpose: 'business' | 'personal'
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MileageGap {
  id: string
  userId: string
  startDate: string
  endDate: string
  expectedMiles: number
  actualMiles: number
  gapMiles: number
  status: 'open' | 'resolved' | 'ignored'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface UploadedFile {
  id: string
  userId: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  processed: boolean
  extractedTrips?: number
  createdAt: string
}
