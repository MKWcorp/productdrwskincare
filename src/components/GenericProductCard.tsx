import React from 'react'
import { DatabaseProduct } from "../types"
import { useDrwSkincareConfig } from './DrwSkincareProvider'
import { createWhatsAppMessage, formatPrice } from '../lib/generic-utils'
import { SafeImage } from './SafeImage'

interface GenericProductCardProps {
  product: DatabaseProduct
  className?: string
  onWhatsAppClick?: (product: DatabaseProduct) => void
  onProductClick?: (product: DatabaseProduct) => void
  showBPOM?: boolean
  showCategories?: boolean
  customButtonText?: string
  showButton?: boolean
}

export const GenericProductCard: React.FC<GenericProductCardProps> = ({
  product,
  className = '',
  onWhatsAppClick,
  onProductClick,
  showBPOM = true,
  showCategories = true,
  customButtonText,
  showButton = true
}) => {
  const config = useDrwSkincareConfig()

  const handleWhatsAppClick = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick(product)
    } else if (config.site.features?.whatsappIntegration) {
      const whatsappUrl = createWhatsAppMessage(
        product.nama_produk,
        product.harga_umum,
        config.site.whatsappNumber,
        config.site.name
      )
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product)
    }
    // Default behavior could be handled by parent component
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Product Image */}
      <div 
        className="aspect-square relative bg-gray-100 cursor-pointer"
        onClick={handleProductClick}
      >
        <SafeImage
          src={
            product.foto_produk && product.foto_produk.length > 0
              ? product.foto_produk[0].url_foto
              : product.foto_utama
          }
          alt={product.nama_produk}
          fill={true}
          className="object-cover"
          placeholderText="Foto Produk"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 cursor-pointer hover:underline"
          onClick={handleProductClick}
        >
          {product.nama_produk}
        </h3>

        {product.deskripsi_singkat && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.deskripsi_singkat}
          </p>
        )}

        {/* Categories */}
        {showCategories && product.categories && product.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {category.nama_kategori}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xl font-bold"
            style={{ color: config.site.primaryColor }}
          >
            {formatPrice(product.harga_umum, config.currency, config.locale)}
          </span>
          {showBPOM && product.bpom && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              BPOM: {product.bpom}
            </span>
          )}
        </div>

        {showButton && config.site.features?.whatsappIntegration && (
          <button
            onClick={handleWhatsAppClick}
            className="w-full text-white py-2 px-4 rounded-lg transition-colors duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: config.site.primaryColor || '#10B981',
            }}
          >
            {customButtonText || `Pesan via WhatsApp`}
          </button>
        )}
      </div>
    </div>
  )
}