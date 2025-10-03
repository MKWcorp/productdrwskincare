"use client"

import { useState, useMemo } from "react"
import { DatabaseProduct } from "@/types"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils"
import { siteConfig, getThemeColors } from "@/lib/config"
import { useProducts, useCategories } from "@/hooks/useProducts"

interface ProductListProps {
  className?: string
  showSearch?: boolean
  showCategories?: boolean
  itemsPerPage?: number
  initialFilters?: {
    category?: string
    search?: string
    featured?: boolean
  }
}

export function ProductList({ 
  className,
  showSearch = true,
  showCategories = true,
  itemsPerPage = 12,
  initialFilters = {}
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || "")
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || "all")
  const [currentPage, setCurrentPage] = useState(1)
  const themeColors = getThemeColors()

  // Fetch products from database
  const { products, loading, error } = useProducts({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchTerm || undefined,
    featured: initialFilters.featured
  })

  // Fetch categories
  const { categories: dbCategories, loading: categoriesLoading } = useCategories()
  
  // Get unique categories
  const categories = useMemo(() => {
    return ["all", ...dbCategories]
  }, [dbCategories])

  // Filter products (client-side filtering for pagination)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.deskripsi_singkat && product.deskripsi_singkat.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || 
        (product.categories && product.categories.some(cat => cat.nama_kategori === selectedCategory))
      
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Loading state
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Produk {siteConfig.name}
          </h2>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-2xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Produk {siteConfig.name}
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">⚠️ Gagal memuat produk dari database</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Produk {siteConfig.name}
        </h2>
        <p className="text-gray-600">
          Temukan produk perawatan kulit terbaik untuk kebutuhan Anda
        </p>
      </div>

      {/* Filters */}
      {(showSearch || showCategories) && (
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-2 focus:outline-none transition-colors"
                style={{ 
                  '--tw-ring-color': themeColors.primary,
                  borderColor: searchTerm ? themeColors.primary : undefined
                } as React.CSSProperties}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}

          {/* Categories */}
          {showCategories && categories.length > 2 && !categoriesLoading && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === category
                      ? "text-white shadow-md"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                  )}
                  style={{
                    backgroundColor: selectedCategory === category ? themeColors.primary : undefined
                  }}
                >
                  {category === "all" ? "Semua" : category}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-gray-600">
        {filteredProducts.length === 0 ? (
          <p>Tidak ada produk yang ditemukan</p>
        ) : (
          <p>
            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
            {searchTerm && ` untuk "${searchTerm}"`}
            {selectedCategory !== "all" && ` dalam kategori "${selectedCategory}"`}
          </p>
        )}
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard 
              key={product.id_produk} 
              product={product}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            ← Sebelumnya
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 rounded-lg font-medium transition-colors",
                  currentPage === page
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                style={{
                  backgroundColor: currentPage === page ? themeColors.primary : undefined
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Tidak ada produk ditemukan
          </h3>
          <p className="text-gray-600 mb-4">
            Coba ubah kata kunci pencarian atau pilih kategori lain
          </p>
          {(searchTerm || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: themeColors.primary }}
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}