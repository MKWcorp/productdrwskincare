// Image utility functions for handling null/invalid images
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
    return false
  }
  
  // Check if URL is valid format
  try {
    new URL(url)
    return true
  } catch {
    // If not absolute URL, check if it's a relative path
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
  }
}

export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!isValidImageUrl(url)) {
    return null
  }
  
  // Remove common problematic values
  const cleanUrl = url!.trim()
  if (cleanUrl === 'null' || cleanUrl === 'undefined' || cleanUrl === '') {
    return null
  }
  
  return cleanUrl
}

export function getValidImages(images: Array<{ url_foto: string; alt_text?: string; urutan?: number }> | null | undefined): Array<{ url_foto: string; alt_text?: string; urutan?: number }> {
  if (!images || !Array.isArray(images)) {
    return []
  }
  
  return images.filter(img => isValidImageUrl(img.url_foto))
}

export function getFallbackImage(): string {
  return '/placeholder-product.jpg' // You can create a placeholder image
}

export function getProductImage(product: {
  foto_utama?: string | null
  foto_produk?: Array<{ url_foto: string; alt_text?: string; urutan?: number }> | null
}): string | null {
  // Try foto_produk first (gallery images)
  const validGalleryImages = getValidImages(product.foto_produk)
  if (validGalleryImages.length > 0) {
    return sanitizeImageUrl(validGalleryImages[0].url_foto)
  }
  
  // Try foto_utama (main image)
  const mainImage = sanitizeImageUrl(product.foto_utama)
  if (mainImage) {
    return mainImage
  }
  
  // Return null if no valid image found (component should handle fallback)
  return null
}