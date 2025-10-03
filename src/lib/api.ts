import { Product, DatabaseProduct } from '@/types'
import { prisma } from './db'

export interface ProductsResponse {
  success: boolean
  data: DatabaseProduct[]
  total: number
  error?: string
  message?: string
}

export interface ProductsFilter {
  category?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}

// Transform database product to structured format
export function transformProduct(dbProduct: any): DatabaseProduct {
  // Extract categories from produk_kategori relation
  const categories = dbProduct.produk_kategori?.map((pk: any) => ({
    id: pk.kategori.id,
    nama_kategori: pk.kategori.nama_kategori
  })) || []

  return {
    id_produk: dbProduct.id_produk.toString(), // Convert BigInt to string
    nama_produk: dbProduct.nama_produk,
    bpom: dbProduct.bpom,
    harga_director: dbProduct.harga_director,
    harga_manager: dbProduct.harga_manager,
    harga_supervisor: dbProduct.harga_supervisor,
    harga_consultant: dbProduct.harga_consultant,
    harga_umum: dbProduct.harga_umum,
    foto_utama: dbProduct.foto_utama,
    deskripsi_singkat: dbProduct.deskripsi_singkat,
    created_at: dbProduct.created_at,
    updated_at: dbProduct.updated_at,
    slug: dbProduct.slug,
    foto_produk: dbProduct.foto_produk?.map((fp: any) => ({
      url_foto: fp.url_foto
    })) || [],
    categories: categories,
    primary_category: categories.length > 0 ? categories[0].nama_kategori : undefined
  }
}

// Server-side function to fetch products directly from database
export async function getProductsFromDB(filters: ProductsFilter = {}): Promise<ProductsResponse> {
  try {
    const where: any = {}
    
    // Search filter
    if (filters.search) {
      where.OR = [
        { nama_produk: { contains: filters.search, mode: 'insensitive' } },
        { deskripsi_singkat: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      where.produk_kategori = {
        some: {
          kategori: {
            nama_kategori: {
              contains: filters.category,
              mode: 'insensitive'
            }
          }
        }
      }
    }

    const products = await prisma.produk.findMany({
      where,
      include: {
        produk_kategori: {
          include: {
            kategori: true
          }
        },
        produk_detail: true,
        produk_bahan_aktif: {
          include: {
            bahan_aktif: true
          }
        },
        foto_produk: {
          orderBy: { urutan: 'asc' },
          take: 1
        }
      },
      take: filters.limit,
      skip: filters.offset || 0,
      orderBy: { created_at: 'desc' }
    })

    const transformedProducts = products.map(transformProduct)

    return {
      success: true,
      data: transformedProducts,
      total: transformedProducts.length
    }

  } catch (error) {
    console.error('Database error:', error)
    return {
      success: false,
      data: [],
      total: 0,
      error: 'Failed to fetch products from database',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Client-side function to fetch products via API
export async function fetchProducts(filters: ProductsFilter = {}): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
    const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
    
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      data: [],
      total: 0,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getCategoriesFromDB(): Promise<string[]> {
  try {
    const categories = await prisma.kategori.findMany({
      select: { nama_kategori: true },
      orderBy: { nama_kategori: 'asc' }
    })
    return categories.map(cat => cat.nama_kategori)
  } catch (error) {
    console.error('Error fetching categories from DB:', error)
    return []
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch('/api/categories', {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.data : []
    }
    return []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function fetchFeaturedProducts(limit: number = 6): Promise<DatabaseProduct[]> {
  try {
    const response = await fetchProducts({ featured: true, limit })
    return response.success ? response.data : []
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}