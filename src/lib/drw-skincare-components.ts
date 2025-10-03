// Main library exports - untuk digunakan sebagai NPM package
export { DrwSkincareProvider, useDrwSkincareConfig } from '../components/DrwSkincareProvider'
export { GenericProductCard } from '../components/GenericProductCard'
export { GenericProductDetail } from '../components/GenericProductDetail'
export { GenericProductList } from '../components/GenericProductList'
export { SafeImage } from '../components/SafeImage'

// Types exports
export type { 
  SiteConfig, 
  APIConfig, 
  ComponentConfig
} from '../types/config'
export type { DatabaseProduct } from '../types'

// Utilities exports
export { 
  createWhatsAppMessage,
  formatPrice,
  buildApiUrl,
  mergeConfigurations 
} from './generic-utils'

// Default configurations
export { defaultSiteConfig, defaultAPIConfig } from '../types/config'

// Hooks
export { useProducts, useProduct, useCategories } from './hooks'