import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Mock PDF processing result
    const mockExtractedTrips = [
      {
        id: `extracted-trip-${Date.now()}`,
        date: '2024-01-22',
        startOdometer: 50300,
        endOdometer: 50450,
        miles: 150,
        purpose: 'business' as const,
        location: 'Extracted from PDF',
        notes: 'Auto-extracted from uploaded document'
      }
    ]

    return NextResponse.json({
      data: {
        filename: file.name,
        size: file.size,
        extractedTrips: mockExtractedTrips,
        processed: true
      }
    })
  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
