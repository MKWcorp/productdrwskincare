import { useState, useEffect } from 'react'
import { ComponentConfig } from '../types/config'
import { fetchWithConfig, buildApiUrl } from './generic-utils'

// Generic hook for fetching products
export const useProducts = (
  config: ComponentConfig,
  filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
  }
) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const baseUrl = config.api?.baseUrl || '/api'
        const endpoint = config.api?.endpoints?.products || '/products'
        const url = buildApiUrl(baseUrl + endpoint, '', filters)

        const response = await fetchWithConfig(url)
        
        if (response.success) {
          setProducts(response.data || [])
        } else {
          setError(response.error || 'Failed to fetch products')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [config, filters])

  return { products, loading, error }
}

// Generic hook for fetching single product
export const useProduct = (
  config: ComponentConfig,
  slug: string
) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const baseUrl = config.api?.baseUrl || '/api'
        const endpoint = config.api?.endpoints?.products || '/products'
        const url = `${baseUrl}${endpoint}/${slug}`

        const response = await fetchWithConfig(url)
        
        if (response.success) {
          setProduct(response.data)
        } else {
          setError(response.error || 'Product not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [config, slug])

  return { product, loading, error }
}

// Generic hook for fetching categories
export const useCategories = (config: ComponentConfig) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const baseUrl = config.api?.baseUrl || '/api'
        const endpoint = config.api?.endpoints?.categories || '/categories'
        const url = `${baseUrl}${endpoint}`

        const response = await fetchWithConfig(url)
        
        if (response.success) {
          setCategories(response.data || [])
        } else {
          setError(response.error || 'Failed to fetch categories')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [config])

  return { categories, loading, error }
}