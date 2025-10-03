import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { isValidImageUrl } from '@/lib/image-utils'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  onError?: () => void
  showPlaceholder?: boolean
  placeholderText?: string
}

export function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false,
  className = '',
  onError,
  showPlaceholder = true,
  placeholderText = 'Foto Produk'
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
    
    // Report broken image to API
    if (src && typeof window !== 'undefined') {
      fetch('/api/images/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: src })
      }).catch(console.error)
    }
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // Show placeholder if no valid src or error occurred
  if (!isValidImageUrl(src) || imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        {showPlaceholder && (
          <div className="text-gray-400 text-center">
            <FontAwesomeIcon icon={faImage} className="text-2xl mb-2" />
            <div className="text-sm">{placeholderText}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="text-gray-400">
            <FontAwesomeIcon icon={faImage} className="text-2xl animate-pulse" />
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized // Skip Next.js optimization for external URLs
      />
    </div>
  )
}