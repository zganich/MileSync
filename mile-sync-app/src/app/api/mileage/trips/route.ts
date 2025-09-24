import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock data for demo
const mockTrips = [
  {
    id: 'trip-1',
    userId: 'demo-user-id',
    date: '2024-01-15',
    startOdometer: 50000,
    endOdometer: 50150,
    miles: 150,
    purpose: 'business' as const,
    location: 'Downtown to Airport',
    notes: 'Client meeting',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'trip-2',
    userId: 'demo-user-id',
    date: '2024-01-16',
    startOdometer: 50150,
    endOdometer: 50300,
    miles: 150,
    purpose: 'business' as const,
    location: 'Airport to Downtown',
    notes: 'Return trip',
    createdAt: '2024-01-16T18:00:00Z',
    updatedAt: '2024-01-16T18:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify token (simplified for demo)
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ data: mockTrips })
  } catch (error) {
    console.error('Get trips error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const { date, startOdometer, endOdometer, purpose, location, notes } = await request.json()

    if (!date || !startOdometer || !endOdometer || !purpose) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    const miles = endOdometer - startOdometer
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId: 'demo-user-id',
      date,
      startOdometer,
      endOdometer,
      miles,
      purpose,
      location,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ data: newTrip }, { status: 201 })
  } catch (error) {
    console.error('Create trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
