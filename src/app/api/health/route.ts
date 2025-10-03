import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseConnection, getConnectionPoolInfo } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const isConnected = await checkDatabaseConnection()
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }

    const poolInfo = await getConnectionPoolInfo()

    return NextResponse.json({
      success: true,
      message: 'Database connection healthy',
      connectionPool: poolInfo,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}