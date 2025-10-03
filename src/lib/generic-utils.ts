import { SiteConfig, ComponentConfig } from '../types/config'

// Generic utility functions that work with any configuration
export const createWhatsAppMessage = (
  productName: string, 
  price: number, 
  whatsappNumber: string,
  siteName: string = 'Toko Online'
) => {
  const message = `Halo, saya tertarik dengan produk *${productName}* seharga Rp ${price.toLocaleString('id-ID')} dari ${siteName}. Bisakah saya mendapatkan informasi lebih lanjut?`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const formatPrice = (
  price: number | null | undefined, 
  currency: 'IDR' | 'USD' = 'IDR',
  locale: 'id-ID' | 'en-US' = 'id-ID'
) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Hubungi Kami'
  }
  
  const currencySymbol = currency === 'IDR' ? 'Rp' : '$'
  return `${currencySymbol} ${price.toLocaleString(locale)}`
}

export const getThemeColors = (config: ComponentConfig) => ({
  primary: config.theme?.primary || config.site.primaryColor || '#FF6B9D',
  secondary: config.theme?.secondary || config.site.secondaryColor || '#4ECDC4',
  accent: config.theme?.accent || '#45B7D1',
  dark: config.theme?.dark || '#2C3E50',
  light: config.theme?.light || '#F8F9FA',
})

export const buildApiUrl = (
  baseUrl: string, 
  endpoint: string, 
  params?: Record<string, string>
): string => {
  const url = new URL(endpoint, baseUrl)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  return url.toString()
}

// Generic fetch function with configuration
export const fetchWithConfig = async (
  url: string,
  options?: RequestInit
): Promise<any> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Create a configuration context
export const mergeConfigurations = (
  userConfig: Partial<ComponentConfig>,
  defaultConfig: ComponentConfig
): ComponentConfig => {
  return {
    site: { ...defaultConfig.site, ...userConfig.site },
    api: { ...defaultConfig.api, ...userConfig.api },
    theme: { ...defaultConfig.theme, ...userConfig.theme },
    locale: userConfig.locale || defaultConfig.locale || 'id-ID',
    currency: userConfig.currency || defaultConfig.currency || 'IDR'
  }
}