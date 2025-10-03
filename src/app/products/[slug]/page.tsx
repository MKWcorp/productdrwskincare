/**
 * Dynamic Product Detail Page
 * 
 * @description Halaman detail produk DR.W Skincare dengan slug routing
 * @author MKWCorp
 * @version 1.0.0
 * 
 * Route: /products/[slug]
 * Example: /products/drw-whitening-serum
 */

import { Metadata } from 'next'
import { ProductDetail } from '@/components/ProductDetail'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await prisma.produk.findUnique({
      where: { slug: params.slug },
      select: {
        nama_produk: true,
        deskripsi_singkat: true,
        foto_utama: true,
        harga_umum: true,
        bpom: true,
        produk_detail: {
          select: {
            kegunaan: true
          }
        }
      }
    })

    if (!product) {
      return {
        title: 'Produk Tidak Ditemukan | DR.W Skincare',
        description: 'Produk yang Anda cari tidak tersedia.'
      }
    }

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DR.W Skincare'
    const description = product.deskripsi_singkat || 
                       product.produk_detail?.kegunaan || 
                       `${product.nama_produk} - Produk perawatan kulit berkualitas dari ${siteName}`

    return {
      title: `${product.nama_produk} | ${siteName}`,
      description: description.substring(0, 160),
      keywords: [
        product.nama_produk,
        'DR.W Skincare',
        'skincare',
        'perawatan kulit',
        'kosmetik',
        'BPOM',
        siteName
      ].join(', '),
      openGraph: {
        title: `${product.nama_produk} | ${siteName}`,
        description,
        images: product.foto_utama ? [
          {
            url: product.foto_utama,
            width: 800,
            height: 800,
            alt: product.nama_produk
          }
        ] : [],
        type: 'website',
        locale: 'id_ID'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.nama_produk} | ${siteName}`,
        description,
        images: product.foto_utama ? [product.foto_utama] : []
      },
      alternates: {
        canonical: `/products/${params.slug}`
      },
      other: {
        'product:price:amount': product.harga_umum.toString(),
        'product:price:currency': 'IDR',
        'product:brand': siteName,
        'product:availability': 'in stock',
        'product:condition': 'new'
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'DR.W Skincare',
      description: 'Produk perawatan kulit berkualitas'
    }
  }
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const products = await prisma.produk.findMany({
      where: {
        slug: {
          not: null
        }
      },
      select: {
        slug: true
      },
      take: 100 // Limit untuk build performance
    })

    return products.map((product: any) => ({
      slug: product.slug!
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Main page component
export default async function ProductPage({ params }: ProductPageProps) {
  // Verify product exists
  const productExists = await prisma.produk.findUnique({
    where: { slug: params.slug },
    select: { id_produk: true }
  })

  if (!productExists) {
    notFound()
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Loading...", // Will be replaced by client-side data
            "description": "Produk perawatan kulit DR.W Skincare",
            "brand": {
              "@type": "Brand",
              "name": process.env.NEXT_PUBLIC_SITE_NAME || "DR.W Skincare"
            },
            "category": "Beauty & Personal Care",
            "offers": {
              "@type": "Offer",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${params.slug}`,
              "priceCurrency": "IDR",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": process.env.NEXT_PUBLIC_SITE_NAME || "DR.W Skincare"
              }
            }
          })
        }}
      />
      
      {/* Product Detail Component */}
      <ProductDetail slug={params.slug} />
    </>
  )
}