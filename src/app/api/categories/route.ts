import { NextResponse } from 'next/server'
import { getCategoriesFromDB } from '@/lib/api'

export async function GET() {
  try {
    const categories = await getCategoriesFromDB()
    const result = {
      success: true,
      data: categories,
      total: categories.length
    }
    
    // Convert BigInt to string for JSON serialization
    const jsonString = JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
    
    return new Response(jsonString, {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}