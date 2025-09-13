import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Demo login for now (bypass database)
    if (email === 'demo@milesync.com' && password === 'demo123') {
      // Generate JWT token
      const token = jwt.sign(
        { userId: 'demo-user-id' },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      )

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
          user: userData,
          token
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
