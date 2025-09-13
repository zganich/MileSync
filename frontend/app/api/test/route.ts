import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const result = await db.execute('SELECT 1 as test')
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      test: result
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 })
  }
}
