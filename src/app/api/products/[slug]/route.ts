/**
 * Product Detail API Route
 * 
 * @description API endpoint untuk mengambil detail produk berdasarkan slug
 * @author MKWCorp
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { transformProduct } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    // Fetch product with all related data
    const product = await prisma.produk.findUnique({
      where: { slug },
      include: {
        produk_kategori: {
          include: {
            kategori: true
          }
        },
        produk_detail: true,
        produk_bahan_aktif: {
          include: {
            bahan_aktif: true
          }
        },
        foto_produk: {
          orderBy: { urutan: 'asc' }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform product data with extended information
    const transformedProduct = {
      ...transformProduct(product),
      // Extended fields for detail page
      kegunaan: product.produk_detail?.kegunaan,
      komposisi: product.produk_detail?.komposisi,
      cara_pakai: product.produk_detail?.cara_pakai,
      netto: product.produk_detail?.netto,
      no_bpom: product.produk_detail?.no_bpom,
      bahan_aktif: product.produk_bahan_aktif?.map(pba => ({
        nama_bahan: pba.bahan_aktif.nama_bahan,
        fungsi: pba.fungsi
      })) || [],
      foto_produk: product.foto_produk?.map(foto => ({
        url_foto: foto.url_foto,
        alt_text: foto.alt_text || product.nama_produk,
        urutan: foto.urutan
      })) || []
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })

  } catch (error) {
    console.error('Product Detail API Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product detail',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}