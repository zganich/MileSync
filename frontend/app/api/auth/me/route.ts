import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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
      
      // Demo user for now (bypass database)
      if (decoded.userId === 'demo-user-id') {
        const userData = {
          id: 'demo-user-id',
          email: 'demo@milesync.com',
          firstName: 'Demo',
          lastName: 'User',
          phone: '+1-555-0123',
          isActive: true,
          lastLogin: new Date().toISOString()
        }

        return NextResponse.json({
          data: {
            user: userData
          }
        })
      }

      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
