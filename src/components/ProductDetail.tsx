/**
 * ProductDetail Component
 * 
 * @description Halaman detail produk DR.W Skincare dengan informasi lengkap
 * @author MKWCorp
 * @version 1.0.0
 * 
 * Features:
 * - Gallery foto produk dengan multiple images
 * - Informasi lengkap produk (nama, harga, deskripsi, BPOM)
 * - Detail produk (kegunaan, komposisi, cara pakai, netto)
 * - Daftar bahan aktif dan fungsinya
 * - WhatsApp integration dengan pre-filled message
 * - Related products dari kategorisama
 * - Breadcrumb navigation
 * - SEO optimization dengan meta tags
 */

"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { DatabaseProduct } from '@/types'
import { formatPrice, cn } from '@/lib/utils'
import { siteConfig, getThemeColors, getWhatsAppMessage } from '@/lib/config'
import { ProductCard } from './ProductCard'

interface ProductDetailProps {
  slug: string
}

interface DetailedProduct extends DatabaseProduct {
  // Extended product information
  kegunaan?: string
  komposisi?: string
  cara_pakai?: string
  netto?: string
  no_bpom?: string
  bahan_aktif?: Array<{
    nama_bahan: string
    fungsi?: string
  }>
  foto_produk?: Array<{
    url_foto: string
    alt_text?: string
    urutan: number
  }>
  related_products?: DatabaseProduct[]
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const [product, setProduct] = useState<DetailedProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const themeColors = getThemeColors()

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch product')
        }

        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
          
          // Fetch related products from same category
          if (data.data.category) {
            const relatedResponse = await fetch(`/api/products?category=${data.data.category}&limit=4`)
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              if (relatedData.success) {
                // Filter out current product
                const filtered = relatedData.data.filter((p: DatabaseProduct) => p.slug !== slug)
                setRelatedProducts(filtered.slice(0, 3))
              }
            }
          }
        } else {
          setError(data.message || 'Product not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [slug])

  const handleWhatsAppOrder = () => {
    if (!product) return
    
    const message = `Halo, saya tertarik dengan produk ${product.nama_produk} dari ${siteConfig.name}.
    
Harga: ${formatPrice(product.harga_umum)}
${product.bpom ? `BPOM: ${product.bpom}` : ''}

Mohon info lebih lanjut untuk pemesanan.

Link produk: ${window.location.href}`

    const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || 'Produk yang Anda cari tidak tersedia'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColors.primary }}
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  const images = product.foto_produk && product.foto_produk.length > 0 
    ? product.foto_produk.sort((a, b) => a.urutan - b.urutan)
    : [{ url_foto: product.foto_utama || '', alt_text: product.nama_produk, urutan: 0 }]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-gray-800 transition-colors">Home</a>
          <span>→</span>
          <a href="/products" className="hover:text-gray-800 transition-colors">Produk</a>
          <span>→</span>
          {product.category && (
            <>
              <a 
                href={`/products?category=${product.category}`}
                className="hover:text-gray-800 transition-colors"
              >
                {product.category}
              </a>
              <span>→</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{product.nama_produk}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={images[selectedImageIndex]?.url_foto || product.foto_utama || ''}
                alt={images[selectedImageIndex]?.alt_text || product.nama_produk}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImageIndex === index 
                        ? "border-blue-500" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={image.url_foto}
                      alt={image.alt_text || `${product.nama_produk} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-flex">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: themeColors.secondary }}
                >
                  {product.category}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              {product.nama_produk}
            </h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.discount && product.discount > 0 && (
                <p className="text-green-600 font-medium">
                  Hemat {product.discount}% dari harga normal!
                </p>
              )}
            </div>

            {/* BPOM Information */}
            {(product.bpom || product.no_bpom) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-semibold">✓ BPOM:</span>
                  <span className="text-green-800 font-mono">
                    {product.no_bpom || product.bpom}
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Produk terdaftar dan aman digunakan
                </p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                product.stock > 10 
                  ? "bg-green-100 text-green-800"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              )}>
                {product.stock > 10 
                  ? "✓ Stok Tersedia"
                  : product.stock > 0
                  ? `⚠️ Stok Terbatas (${product.stock})`
                  : "❌ Stok Habis"
                }
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={product.stock === 0}
              className={cn(
                "w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200",
                "flex items-center justify-center space-x-3",
                product.stock === 0 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              )}
              style={{ 
                backgroundColor: product.stock === 0 ? undefined : themeColors.primary
              }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>
                {product.stock === 0 ? 'Stok Habis' : 'Pesan via WhatsApp'}
              </span>
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-16">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {[
                { key: 'kegunaan', label: 'Kegunaan & Manfaat', icon: '🎯' },
                { key: 'komposisi', label: 'Komposisi', icon: '🧪' },
                { key: 'cara_pakai', label: 'Cara Pakai', icon: '📋' },
                { key: 'bahan_aktif', label: 'Bahan Aktif', icon: '⚗️' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className="flex-shrink-0 px-6 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 border-b-2 border-transparent hover:border-gray-300 transition-colors whitespace-nowrap"
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Kegunaan */}
            {product.kegunaan && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Kegunaan & Manfaat
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.kegunaan}
                  </p>
                </div>
              </div>
            )}

            {/* Komposisi */}
            {product.komposisi && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🧪</span>
                  Komposisi
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.komposisi}
                  </p>
                </div>
              </div>
            )}

            {/* Cara Pakai */}
            {product.cara_pakai && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Cara Pakai
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.cara_pakai}
                  </p>
                </div>
              </div>
            )}

            {/* Bahan Aktif */}
            {product.bahan_aktif && product.bahan_aktif.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">⚗️</span>
                  Bahan Aktif
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.bahan_aktif.map((bahan, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {typeof bahan === 'string' ? bahan : bahan.nama_bahan}
                      </h4>
                      {typeof bahan === 'object' && bahan.fungsi && (
                        <p className="text-sm text-gray-600">
                          {bahan.fungsi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Specifications */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Spesifikasi Produk
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.netto && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Netto:</span>
                    <span className="font-medium text-gray-800">{product.netto}</span>
                  </div>
                )}
                {(product.bpom || product.no_bpom) && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">No. BPOM:</span>
                    <span className="font-medium text-gray-800 font-mono">
                      {product.no_bpom || product.bpom}
                    </span>
                  </div>
                )}
                {product.category && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="font-medium text-gray-800">{product.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Produk Serupa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id_produk} 
                  product={relatedProduct}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}