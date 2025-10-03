import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { getProductImage, getValidImages, isValidImageUrl } from '@/lib/image-utils'
import { SafeImage } from './SafeImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faExclamationTriangle, 
  faCheckCircle, 
  faFlask, 
  faLeaf, 
  faClipboardList, 
  faAtom,
  faChartBar,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
import { DatabaseProduct } from '../types'
import { cn } from '../lib/utils'
import { useDrwSkincareConfig } from './DrwSkincareProvider'
import { createWhatsAppMessage, formatPrice, buildApiUrl } from '../lib/generic-utils'
import { GenericProductCard } from './GenericProductCard'

interface GenericProductDetailProps {
  slug: string
  onProductNotFound?: () => void
  onProductLoad?: (product: DetailedProduct) => void
  customTabs?: TabConfig[]
  showRelatedProducts?: boolean
  relatedProductsLimit?: number
  customWhatsAppMessage?: (product: DetailedProduct) => string
  className?: string
}

interface TabConfig {
  id: string
  label: string
  icon?: any
  content: (product: DetailedProduct) => React.ReactNode
}

interface DetailedProduct extends DatabaseProduct {
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
  discount?: number
  stock?: number
  description?: string
  category?: string
}

const defaultTabs: TabConfig[] = [
  {
    id: 'kegunaan',
    label: 'Kegunaan',
    icon: faCheckCircle,
    content: (product) => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Kegunaan & Manfaat</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {product.kegunaan || product.deskripsi_singkat || 'Informasi kegunaan belum tersedia.'}
        </p>
      </div>
    )
  },
  {
    id: 'komposisi',
    label: 'Komposisi',
    icon: faFlask,
    content: (product) => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FontAwesomeIcon icon={faFlask} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Komposisi</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {product.komposisi || 'Informasi komposisi belum tersedia.'}
        </p>
      </div>
    )
  },
  {
    id: 'cara_pakai',
    label: 'Cara Pakai',
    icon: faClipboardList,
    content: (product) => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FontAwesomeIcon icon={faClipboardList} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Cara Pakai</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {product.cara_pakai || 'Informasi cara pakai belum tersedia.'}
        </p>
      </div>
    )
  },
  {
    id: 'bahan_aktif',
    label: 'Bahan Aktif',
    icon: faAtom,
    content: (product) => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FontAwesomeIcon icon={faAtom} className="text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Bahan Aktif</h3>
        </div>
        {product.bahan_aktif && product.bahan_aktif.length > 0 ? (
          <div className="space-y-3">
            {product.bahan_aktif.map((bahan, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1">{bahan.nama_bahan}</h4>
                {bahan.fungsi && (
                  <p className="text-sm text-gray-600">{bahan.fungsi}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">Informasi bahan aktif belum tersedia.</p>
        )}
      </div>
    )
  }
]

export const GenericProductDetail: React.FC<GenericProductDetailProps> = ({
  slug,
  onProductNotFound,
  onProductLoad,
  customTabs,
  showRelatedProducts = true,
  relatedProductsLimit = 4,
  customWhatsAppMessage,
  className = ''
}) => {
  const config = useDrwSkincareConfig()
  const [product, setProduct] = useState<DetailedProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState((customTabs || defaultTabs)[0]?.id || 'kegunaan')

  const tabs = customTabs || defaultTabs

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = buildApiUrl(`/products/${slug}`, config.api)
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          if (response.status === 404) {
            if (onProductNotFound) {
              onProductNotFound()
            } else {
              notFound()
            }
            return
          }
          throw new Error('Failed to fetch product')
        }

        const data = await response.json()
        if (data.success) {
          setProduct(data.data)
          onProductLoad?.(data.data)
          
          // Fetch related products if enabled
          if (showRelatedProducts && data.data.category) {
            const relatedApiUrl = buildApiUrl(
              `/products?category=${data.data.category}&limit=${relatedProductsLimit + 1}`,
              config.api
            )
            const relatedResponse = await fetch(relatedApiUrl)
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json()
              if (relatedData.success) {
                const filtered = relatedData.data.filter((p: DatabaseProduct) => p.slug !== slug)
                setRelatedProducts(filtered.slice(0, relatedProductsLimit))
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
  }, [slug, config.api, showRelatedProducts, relatedProductsLimit, onProductNotFound, onProductLoad])

  const handleWhatsAppOrder = () => {
    if (!product || !config.site.features?.whatsappIntegration) return
    
    let message: string
    if (customWhatsAppMessage) {
      message = customWhatsAppMessage(product)
    } else {
      message = createWhatsAppMessage(
        product.nama_produk,
        product.harga_umum,
        config.site.whatsappNumber,
        config.site.name,
        {
          bpom: product.bpom,
          currentUrl: typeof window !== 'undefined' ? window.location.href : undefined
        }
      )
    }

    const url = `https://wa.me/${config.site.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const getProductImages = (product: DetailedProduct): string[] => {
    const images: string[] = []
    
    // Add main image if exists
    if (product.foto_utama && isValidImageUrl(product.foto_utama)) {
      images.push(product.foto_utama)
    }
    
    // Add additional images
    if (product.foto_produk && product.foto_produk.length > 0) {
      const validImages = getValidImages(product.foto_produk.map(foto => foto.url_foto))
      images.push(...validImages)
    }
    
    // Remove duplicates
    return [...new Set(images)]
  }

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen ${className}`} style={{ backgroundColor: config.site.backgroundColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
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
      <div className={`min-h-screen flex items-center justify-center ${className}`} 
           style={{ backgroundColor: config.site.backgroundColor }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-6xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600">{error || 'Produk yang Anda cari tidak tersedia.'}</p>
        </div>
      </div>
    )
  }

  const productImages = getProductImages(product)

  return (
    <div className={`min-h-screen ${className}`} style={{ backgroundColor: config.site.backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative bg-gray-100 rounded-2xl overflow-hidden">
              <SafeImage
                src={productImages[selectedImageIndex] || productImages[0]}
                alt={product.nama_produk}
                fill={true}
                className="object-cover"
                placeholderText="Foto Produk"
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index 
                        ? "border-blue-500 ring-2 ring-blue-200" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <SafeImage
                      src={image}
                      alt={`${product.nama_produk} ${index + 1}`}
                      fill={true}
                      className="object-cover"
                      placeholderText="Foto"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.nama_produk}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span 
                  className="text-3xl font-bold"
                  style={{ color: config.site.primaryColor }}
                >
                  {formatPrice(product.harga_umum, config.currency, config.locale)}
                </span>
                
                {product.bpom && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    BPOM: {product.bpom}
                  </span>
                )}
              </div>

              {product.netto && (
                <p className="text-gray-600 mb-2">
                  <strong>Netto:</strong> {product.netto}
                </p>
              )}

              {product.deskripsi_singkat && (
                <p className="text-gray-700 leading-relaxed">
                  {product.deskripsi_singkat}
                </p>
              )}
            </div>

            {/* WhatsApp Button */}
            {config.site.features?.whatsappIntegration && (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 hover:opacity-90 transform hover:scale-105"
                style={{ backgroundColor: config.site.primaryColor }}
              >
                Pesan via WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    {tab.icon && <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />}
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {tabs.find(tab => tab.id === activeTab)?.content(product)}
          </div>
        </div>

        {/* Related Products */}
        {showRelatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <GenericProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}