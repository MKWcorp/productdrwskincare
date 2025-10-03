import { NextRequest, NextResponse } from 'next/server'
import { getProductsFromDB, ProductsFilter } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: ProductsFilter = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    }

    const result = await getProductsFromDB(filters)
    
    // Convert BigInt to string for JSON serialization
    const jsonString = JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
    
    return new Response(jsonString, {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}