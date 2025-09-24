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

    // Demo login - simple hardcoded check
    if (email === 'demo@milesync.com' && password === 'demo123') {
      const token = jwt.sign(
        { userId: 'demo-user-id', email: 'demo@milesync.com' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      const userData = {
        id: 'demo-user-id',
        email: 'demo@milesync.com',
        firstName: 'Demo',
        lastName: 'User',
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
