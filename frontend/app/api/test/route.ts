import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple test without database to avoid infinite loops
    return NextResponse.json({
      status: 'success',
      message: 'API endpoint working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test endpoint failed',
      error: error.message
    }, { status: 500 })
  }
}
