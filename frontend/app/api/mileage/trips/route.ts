import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { eq, desc } from 'drizzle-orm'
import { db, trips } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      
      const userTrips = await db.select().from(trips)
        .where(eq(trips.userId, decoded.userId))
        .orderBy(desc(trips.startDate))
      
      return NextResponse.json({
        data: {
          trips: userTrips
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
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
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      
      const tripData = await request.json()
      
      // Calculate total miles
      const totalMiles = tripData.endMileage - tripData.startMileage
      
      const newTrip = await db.insert(trips).values({
        userId: decoded.userId,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        startMileage: tripData.startMileage,
        endMileage: tripData.endMileage,
        totalMiles,
        startLocation: tripData.startLocation,
        endLocation: tripData.endLocation,
        purpose: tripData.purpose,
        businessMiles: tripData.businessMiles,
        personalMiles: tripData.personalMiles,
        notes: tripData.notes,
        source: 'manual'
      }).returning()
      
      return NextResponse.json({
        data: {
          trip: newTrip[0]
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Create trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
