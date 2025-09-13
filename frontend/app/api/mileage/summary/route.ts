import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { eq, sum, count } from 'drizzle-orm'
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
      
      // Get total business miles
      const businessMilesResult = await db.select({
        total: sum(trips.businessMiles)
      }).from(trips).where(eq(trips.userId, decoded.userId))
      
      // Get total trips
      const tripsCountResult = await db.select({
        count: count()
      }).from(trips).where(eq(trips.userId, decoded.userId))
      
      // Get total personal miles
      const personalMilesResult = await db.select({
        total: sum(trips.personalMiles)
      }).from(trips).where(eq(trips.userId, decoded.userId))
      
      const summary = {
        totalBusinessMiles: Number(businessMilesResult[0]?.total) || 0,
        totalPersonalMiles: Number(personalMilesResult[0]?.total) || 0,
        totalTrips: Number(tripsCountResult[0]?.count) || 0,
        totalMiles: (Number(businessMilesResult[0]?.total) || 0) + (Number(personalMilesResult[0]?.total) || 0)
      }
      
      return NextResponse.json({
        data: {
          summary
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Get summary error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
