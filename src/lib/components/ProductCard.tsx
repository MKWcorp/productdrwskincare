import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ProductCardProps } from '../types';
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

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onWhatsAppClick,
  onCategoryClick,
  config = {},
  className = '',
}) => {
  const finalConfig = mergeConfig(config);
  
  const productName = getProductName(product);
  const productImage = getProductImage(product);
  const productDescription = getProductDescription(product);
  const price = getPrice(product, finalConfig.priceRole);
  const formattedPrice = formatPrice(price, finalConfig.currency);
  
  const isPackage = product.type === 'package';
  const categoryName = !isPackage ? getCategoryName(product as any) : '';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onWhatsAppClick) {
      onWhatsAppClick(product);
    } else {
      const url = generateWhatsAppUrl(product, finalConfig);
      window.open(url, '_blank');
    }
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onCategoryClick && categoryName) {
      onCategoryClick(categoryName);
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
    <div className={cn('drw-product-card', className)}>
      {/* Product Image */}
      <div className="drw-product-image">
        <img
          src={productImage}
          alt={productName}
          className="drw-product-image"
          onError={handleImageError}
        />
        
        {/* Image Placeholder */}
        <div className="drw-product-image-placeholder" style={{ display: 'none' }}>
          <div className="text-gray-400 text-center">
            <FontAwesomeIcon 
              icon={faShoppingCart} 
              className="text-4xl mb-2 group-hover:text-primary transition-colors duration-300" 
            />
            <div className="text-sm group-hover:text-primary transition-colors duration-300">
              Foto Produk
            </div>
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="drw-product-overlay"></div>
        
        {/* BPOM Badge */}
        {product.bpom && (
          <div className="drw-product-badge">
            BPOM: {product.bpom}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="drw-product-info">
        {/* Category/Type Badge */}
        <div 
          className={cn(
            'drw-category-badge',
            isPackage ? 'drw-category-badge--package' : 'drw-category-badge--product'
          )}
          onClick={handleCategoryClick}
          style={{ cursor: !isPackage && onCategoryClick ? 'pointer' : 'default' }}
        >
          <FontAwesomeIcon 
            icon={isPackage ? faShoppingCart : faInfoCircle} 
            className="w-3 h-3" 
          />
          {isPackage ? 'PAKET' : categoryName || 'PRODUK'}
        </div>
        
        {/* Product Name */}
        <h3 className="drw-product-title">
          {productName}
        </h3>
        
        {/* Product Description */}
        {productDescription && (
          <p className="drw-product-description">
            {productDescription}
          </p>
        )}
        
        {/* Package Contents Preview */}
        {isPackage && (product as any).packageContents && (product as any).packageContents.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">
              Berisi {(product as any).packageContents.length} produk:
            </p>
            <div className="text-xs text-gray-600">
              {(product as any).packageContents.slice(0, 2).map((item: any, index: number) => (
                <span key={item.id || index}>
                  {getProductName(item)}
                  {index < Math.min(1, (product as any).packageContents.length - 1) && ', '}
                </span>
              ))}
              {(product as any).packageContents.length > 2 && (
                <span className="text-gray-500"> +{(product as any).packageContents.length - 2} lainnya</span>
              )}
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="drw-product-price">
          {formattedPrice}
        </div>
        
        {/* Package Savings Badge */}
        {isPackage && (
          <div className="mb-3">
            <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
              Hemat dengan paket bundling
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="drw-product-actions">
          <button
            onClick={handleWhatsAppClick}
            className="drw-btn-primary"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="mr-1 group-hover:animate-pulse" />
            {isPackage ? 'Pesan Paket' : 'Beli'}
          </button>
          
          <div className="drw-btn-secondary">
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1 group-hover:animate-bounce" />
            Detail
          </div>
        </div>
      </div>
    </div>
  );
};
