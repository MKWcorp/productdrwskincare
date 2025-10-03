export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  imageUrl: string
  category: string
  categories?: string[] // Multiple categories
  bpom?: string
  slug?: string
  featured?: boolean
  discount?: number
  stock?: number
  benefits?: string[]
  // Database specific fields
  kegunaan?: string
  komposisi?: string
  cara_pakai?: string
  netto?: string
  no_bpom?: string
  bahan_aktif?: string[]
}

export interface DatabaseProduct {
  id_produk: string // Changed from bigint to string for JSON serialization
  nama_produk: string
  bpom?: string
  harga_director: number
  harga_manager: number
  harga_supervisor: number
  harga_consultant: number
  harga_umum: number
  foto_utama?: string
  deskripsi_singkat?: string
  created_at: Date
  updated_at: Date
  slug?: string
  foto_produk?: {
    url_foto: string
  }[]
  // Categories from produk_kategori relation
  categories?: {
    id: number
    nama_kategori: string
  }[]
  // Primary category (first category)
  primary_category?: string
}

export interface SiteConfig {
  name: string
  subtitle: string
  description: string
  whatsapp: string
  email: string
  address: string
  apiEndpoint: string
  theme: {
    primaryColor: string
    secondaryColor: string
  }
  hero: {
    title: string
    subtitle: string
    ctaText: string
  }
  features: {
    search: boolean
    categories: boolean
    whatsappIntegration: boolean
    priceDisplay: boolean
  }
  seo: {
    keywords: string
    author: string
  }
}