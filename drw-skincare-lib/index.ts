// Main export file for DR.W Skincare Components Library

// Components
export { ProductCard } from './components/ProductCard'
export { ProductList } from './components/ProductList'
export { CategoryFilter } from './components/CategoryFilter'
export { SearchBar } from './components/SearchBar'

// Hooks
export { useDRWProducts } from './hooks/useDRWProducts'
export { useDRWCategories } from './hooks/useDRWCategories'

// Utils
export { formatPrice, generateWhatsAppUrl, cn } from './utils/helpers'
export { createSiteConfig, getThemeColors } from './utils/config'

// Database
export { getProductsFromDB, getCategoriesFromDB, transformProduct } from './database/products'
export { setupPrisma } from './database/client'

// Types
export type { 
  Product, 
  DatabaseProduct, 
  SiteConfig, 
  ProductsFilter,
  ProductsResponse 
} from './types'

// API Routes (for Next.js)
export { ProductsAPI } from './api/products'
export { CategoriesAPI } from './api/categories'

// Constants
export const DR_SKINCARE_DATABASE_URL = 'postgresql://berkomunitas:berkomunitas688@213.190.4.159:5432/drwskincare'
export const DEFAULT_CONFIG = {
  name: 'DR.W Skincare',
  subtitle: 'Solusi Perawatan Kulit Terpercaya',
  whatsapp: '6281234567890',
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af'
}