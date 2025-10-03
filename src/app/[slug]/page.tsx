/**
 * Dynamic Slug Route
 * 
 * @description Route untuk menghandle slug produk dan paket secara langsung
 * Mengecek apakah slug ada di tabel produk atau paket_produk
 * @author MKWCorp
 * @version 1.0.0
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetail } from '@/components/ProductDetail'
import { PackageDetail } from '@/components/PackageDetail'
import { prisma } from '@/lib/db'
import { withRetry, handleDatabaseError } from '@/lib/db-utils'

interface SlugPageProps {
  params: {
    slug: string
  }
}

async function getItemBySlug(slug: string) {
  try {
    // Cek di tabel produk dulu dengan retry mechanism
    const product = await withRetry(async () => {
      return await prisma.produk.findUnique({
        where: { slug },
        select: { 
          id_produk: true, 
          nama_produk: true,
          slug: true,
          deskripsi_singkat: true
        }
      })
    })

    if (product) {
      return { type: 'product', data: product }
    }

    // Jika tidak ada di produk, cek di tabel paket_produk dengan retry
    const package_item = await withRetry(async () => {
      return await prisma.paket_produk.findUnique({
        where: { slug },
        select: { 
          id_paket: true, 
          nama_paket: true,
          slug: true,
          deskripsi: true
        }
      })
    })

    if (package_item) {
      return { type: 'package', data: package_item }
    }

    return null

  } catch (error) {
    console.error('Error in getItemBySlug:', error)
    const dbError = handleDatabaseError(error)
    
    // Log detailed error for debugging
    if (dbError.code === 'P2024') {
      console.error('Database connection pool timeout - check connection settings')
    }
    
    // Return null to show 404 instead of crashing
    return null
  }
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  try {
    const { slug } = params
    const item = await getItemBySlug(slug)

    if (!item) {
      return {
        title: 'Produk Tidak Ditemukan - DR.W Skincare',
        description: 'Produk yang Anda cari tidak ditemukan.'
      }
    }

  const title = item.type === 'product' 
    ? (item.data as any).nama_produk 
    : (item.data as any).nama_paket

  const description = item.type === 'product'
    ? (item.data as any).deskripsi_singkat || `Produk ${(item.data as any).nama_produk} dari DR.W Skincare`
    : (item.data as any).deskripsi || `Paket ${(item.data as any).nama_paket} dari DR.W Skincare`

    return {
      title: `${title} - DR.W Skincare`,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      }
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'DR.W Skincare',
      description: 'Produk skincare berkualitas untuk kulit sehat Anda.'
    }
  }
}

export async function generateStaticParams() {
  try {
    // Generate static params untuk semua produk dan paket dengan retry
    const [products, packages] = await Promise.all([
      withRetry(async () => 
        prisma.produk.findMany({
          where: { slug: { not: null } },
          select: { slug: true }
        })
      ),
      withRetry(async () =>
        prisma.paket_produk.findMany({
          where: { slug: { not: null } },
          select: { slug: true }
        })
      )
    ])

    const params = [
      ...products.filter((p: any) => p.slug).map((p: any) => ({ slug: p.slug! })),
      ...packages.filter((p: any) => p.slug).map((p: any) => ({ slug: p.slug! }))
    ]

    return params
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // Return empty array if database error occurs
    return []
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  try {
    const { slug } = params
    const item = await getItemBySlug(slug)

    if (!item) {
      notFound()
    }

    // Render komponen yang sesuai berdasarkan tipe
    if (item.type === 'product') {
      return <ProductDetail slug={slug} />
    } else {
      return <PackageDetail slug={slug} />
    }
  } catch (error) {
    console.error('Error in SlugPage:', error)
    // Show 404 if there's a database error
    notFound()
  }
}