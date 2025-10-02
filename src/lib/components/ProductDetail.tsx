import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faShoppingCart,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ProductDetailProps } from '../types';
import { 
  getProductName, 
  getProductImage, 
  getProductDescription, 
  getPrice, 
  formatPrice, 
  getCategoryName, 
  generateWhatsAppUrl, 
  cn, 
  mergeConfig 
} from '../utils';

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onWhatsAppClick,
  onBackClick,
  config = {},
  className = '',
  showRelatedProducts = false,
}) => {
  const finalConfig = mergeConfig(config);
  
  const productName = getProductName(product);
  const productImage = getProductImage(product);
  const productDescription = getProductDescription(product);
  const price = getPrice(product, finalConfig.priceRole);
  const formattedPrice = formatPrice(price, finalConfig.currency);
  const categoryName = getCategoryName(product);

  const handleWhatsAppClick = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick(product);
    } else {
      const url = generateWhatsAppUrl(product, finalConfig);
      window.open(url, '_blank');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const placeholder = e.currentTarget.nextElementSibling;
    if (placeholder) {
      (placeholder as HTMLElement).style.display = 'flex';
    }
  };

  return (
    <div className={cn('bg-white', className)}>
      {/* Header with back button */}
      {onBackClick && (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <button
            onClick={onBackClick}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
              
              {/* Image Placeholder */}
              <div 
                className="w-full h-full flex items-center justify-center" 
                style={{ display: 'none' }}
              >
                <div className="text-gray-400 text-center">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-6xl mb-4" />
                  <div className="text-lg">Foto Produk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4" />
              {categoryName}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {productName}
              </h1>
              {product.bpom && (
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  BPOM: {product.bpom}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-3xl lg:text-4xl font-bold text-primary">
              {formattedPrice}
            </div>

            {/* Description */}
            {productDescription && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">
                  {productDescription}
                </p>
              </div>
            )}

            {/* Product Details */}
            {product.produk_detail && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Detail Produk</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.produk_detail.kegunaan && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Kegunaan</h4>
                      <p className="text-gray-700 text-sm">
                        {product.produk_detail.kegunaan}
                      </p>
                    </div>
                  )}
                  
                  {product.produk_detail.cara_pakai && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Cara Pakai</h4>
                      <p className="text-gray-700 text-sm">
                        {product.produk_detail.cara_pakai}
                      </p>
                    </div>
                  )}
                  
                  {product.produk_detail.komposisi && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-1">Komposisi</h4>
                      <p className="text-gray-700 text-sm">
                        {product.produk_detail.komposisi}
                      </p>
                    </div>
                  )}
                  
                  {product.produk_detail.netto && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Netto</h4>
                      <p className="text-gray-700 text-sm">
                        {product.produk_detail.netto}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <div className="sticky bottom-0 bg-white border-t pt-4 space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                Pesan via WhatsApp
              </button>
              
              <p className="text-center text-sm text-gray-600">
                Konsultasi gratis dengan dokter berpengalaman
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
