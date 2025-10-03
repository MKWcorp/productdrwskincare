import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { withRetry } from '@/lib/db-utils'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, productId } = await request.json()
    
    console.log(`⚠️ Broken image reported: ${imageUrl} for product ${productId}`)
    
    // Optional: Update database to mark image as broken
    // await prisma.foto_produk.updateMany({
    //   where: { 
    //     url_foto: imageUrl,
    //     produk_id: BigInt(productId)
    //   },
    //   data: { 
    //     alt_text: 'BROKEN_IMAGE'
    //   }
    // })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Broken image reported' 
    })
    
  } catch (error) {
    console.error('Error reporting broken image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to report broken image' },
      { status: 500 }
    )
  }
}

// Get stats about broken images
export async function GET() {
  try {
    const brokenImages = await withRetry(async () => {
      return await prisma.foto_produk.findMany({
        where: {
          OR: [
            { url_foto: { contains: 'null' } },
            { url_foto: { equals: '' } },
            { alt_text: { contains: 'BROKEN_IMAGE' } }
          ]
        },
        include: {
          produk: {
            select: {
              nama_produk: true,
              slug: true
            }
          }
        }
      })
    })
    
    const stats = {
      total_broken: brokenImages.length,
      products_affected: new Set(brokenImages.map(img => img.produk_id)).size,
      broken_images: brokenImages.map(img => ({
        url: img.url_foto,
        product: img.produk?.nama_produk,
        slug: img.produk?.slug
      }))
    }
    
    return NextResponse.json({
      success: true,
      data: stats
    })
    
  } catch (error) {
    console.error('Error getting broken image stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}