// Generic configuration types for reusable components
export interface SiteConfig {
  name: string
  url?: string
  whatsappNumber: string
  primaryColor?: string
  secondaryColor?: string
  hero?: {
    title?: string
    subtitle?: string
    ctaText?: string
  }
  features?: {
    search?: boolean
    categories?: boolean
    whatsappIntegration?: boolean
    priceDisplay?: boolean
  }
}

export interface APIConfig {
  baseUrl: string
  endpoints?: {
    products?: string
    categories?: string
    packages?: string
  }
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent?: string
  dark?: string
  light?: string
}

// Component-specific configuration
export interface ComponentConfig {
  site: SiteConfig
  api?: APIConfig
  theme?: ThemeColors
  locale?: 'id-ID' | 'en-US'
  currency?: 'IDR' | 'USD'
}

// Default configurations
export const defaultSiteConfig: SiteConfig = {
  name: 'DR.W Skincare',
  url: 'https://drwskincare.com',
  whatsappNumber: '6281234567890',
  primaryColor: '#FF6B9D',
  secondaryColor: '#4ECDC4',
  hero: {
    title: 'Produk Berkualitas untuk Kulit Sehat',
    subtitle: 'Temukan koleksi produk skincare terbaik yang telah terpercaya',
    ctaText: 'Lihat Produk'
  },
  features: {
    search: true,
    categories: true,
    whatsappIntegration: true,
    priceDisplay: true
  }
}

export const defaultAPIConfig: APIConfig = {
  baseUrl: '/api',
  endpoints: {
    products: '/products',
    categories: '/categories',
    packages: '/packages'
  }
}

export const defaultThemeColors: ThemeColors = {
  primary: '#FF6B9D',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  dark: '#2C3E50',
  light: '#F8F9FA'
}