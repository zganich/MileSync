import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock gap data for demo
const mockGaps = [
  {
    id: 'gap-1',
    userId: 'demo-user-id',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    expectedMiles: 200,
    actualMiles: 150,
    gapMiles: 50,
    status: 'open' as const,
    notes: 'Missing mileage for 2 days',
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  },
  {
    id: 'gap-2',
    userId: 'demo-user-id',
    startDate: '2024-01-18',
    endDate: '2024-01-20',
    expectedMiles: 300,
    actualMiles: 250,
    gapMiles: 50,
    status: 'open' as const,
    notes: 'Potential missing business miles',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
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

    return NextResponse.json({ data: mockGaps })
  } catch (error) {
    console.error('Get gaps error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
