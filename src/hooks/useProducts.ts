'use client'

import { useState, useEffect } from 'react'
import { DatabaseProduct } from '@/types'
import { fetchProducts, fetchCategories, ProductsFilter } from '@/lib/api'

export function useProducts(filters: ProductsFilter = {}) {
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchProducts(filters)
      
      if (response.success) {
        setProducts(response.data)
      } else {
        setError(response.message || 'Failed to load products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [filters.category, filters.search, filters.featured, filters.limit])

  return { products, loading, error, refetch: loadProducts }
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading }
}