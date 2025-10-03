'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faInfoCircle, faSpinner, faSearch, faTag } from '@fortawesome/free-solid-svg-icons'
import { formatPrice } from '@/lib/config'

interface Product {
  id_produk: string
  nama_produk: string
  deskripsi_singkat: string | null
  harga_umum: number | null
  foto_utama: string | null
  foto_produk: Array<{
    url_foto: string
    alt_text: string | null
    urutan: number
  }> | null
  slug: string
  bpom: string | null
  created_at: string
  updated_at: string
  categories?: {
    id: number
    nama_kategori: string
  }[]
  primary_category?: string
  is_package?: boolean
  package_contents?: Array<{
    produk_id: number
    nama_produk: string
    jumlah: number
  }>
}

interface Category {
  id: number
  nama_kategori: string
}

// Custom CSS for animations
const styles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .shimmer-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 2s infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .shimmer-effect:hover::before {
    opacity: 1;
  }
`

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, selectedCategory])

  const fetchData = async () => {
    try {
      const [productsResponse, packagesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/packages'),
        fetch('/api/categories')
      ])
      
      const productsResult = await productsResponse.json()
      const packagesResult = await packagesResponse.json()
      const categoriesResult = await categoriesResponse.json()
      
      // Combine products and packages
      let allItems: Product[] = []
      
      if (productsResult.success) {
        allItems = [...allItems, ...productsResult.data]
      }
      
      if (packagesResult.success) {
        allItems = [...allItems, ...packagesResult.data]
      }
      
      // Sort by created_at descending
      allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      setProducts(allItems)
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Gagal memuat data produk')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.deskripsi_singkat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.bpom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories?.some(cat => 
          cat.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.categories?.some(cat => cat.nama_kategori === selectedCategory)
      )
    }

    // Sort products - hanya ketika filter "Semua" (selectedCategory kosong)
    if (!selectedCategory) {
      filtered = filtered.sort((a, b) => {
        // Helper function untuk menentukan jenis produk
        const getProductType = (product: Product) => {
          if (product.is_package) return 'paket'
          if (product.categories?.some(cat => cat.nama_kategori === 'Paket')) return 'paket'
          return 'satuan'
        }

        const typeA = getProductType(a)
        const typeB = getProductType(b)

        // Urutkan: Satuan dulu, baru Paket
        if (typeA !== typeB) {
          if (typeA === 'satuan' && typeB === 'paket') return -1
          if (typeA === 'paket' && typeB === 'satuan') return 1
        }

        // Dalam kategori yang sama, urutkan berdasarkan abjad
        return a.nama_produk.localeCompare(b.nama_produk, 'id-ID')
      })
    } else {
      // Untuk kategori spesifik, tetap urutkan berdasarkan abjad
      filtered = filtered.sort((a, b) => 
        a.nama_produk.localeCompare(b.nama_produk, 'id-ID')
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory('')
    } else {
      setSelectedCategory(categoryName)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedCategory('')
  }

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(Array.from(prev).concat(productId)))
  }

  if (loading) {
    return (
      <div className="py-8 md:py-12 px-4 md:px-6 bg-gray-50">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center">
              <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin mr-4" />
              <span className="text-xl text-gray-600">Memuat produk...</span>
            </div>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg md:rounded-2xl shadow-lg p-3 md:p-6 animate-pulse">
                <div className="h-32 md:h-48 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-2/3"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-6 bg-gray-50">

      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="text-center mb-8">
          <div className="max-w-md mx-auto relative mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk, kategori, atau BPOM..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-12 pr-12 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-gray-700"
              />
              <FontAwesomeIcon 
                icon={faSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {/* Tombol Semua */}
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === ''
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Semua ({products.length})
            </button>
            
            {/* Filter khusus untuk Paket dan Satuan */}
            {['Paket', 'Satuan'].map((categoryName) => {
              const count = products.filter(p => 
                p.categories?.some(cat => cat.nama_kategori === categoryName)
              ).length
              
              // Hanya tampilkan jika ada produk dalam kategori ini
              if (count > 0) {
                return (
                  <button
                    key={categoryName}
                    onClick={() => handleCategoryClick(categoryName)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === categoryName
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {categoryName} ({count})
                  </button>
                )
              }
              return null
            })}
          </div>
        </div>

        {/* Search Results Info */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm md:text-base">
                {filteredProducts.length > 0 ? (
                  <>
                    Menampilkan <span className="font-semibold">{filteredProducts.length}</span> produk
                    {searchQuery && (
                      <> untuk pencarian &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;
                    </>)}
                    {selectedCategory && (
                      <> dalam kategori &ldquo;<span className="font-semibold">{selectedCategory}</span>&rdquo;
                    </>)}
                  </>
                ) : (
                  <>Tidak ditemukan produk yang sesuai</>
                )}
                <button 
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Hapus filter
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              {error}
            </div>
            <button 
              onClick={fetchData}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProducts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">
              <FontAwesomeIcon icon={faSearch} className="text-4xl mb-4" />
              <p>Produk tidak ditemukan</p>
            </div>
            <p className="text-gray-400 mb-6">
              Coba gunakan kata kunci yang berbeda atau hapus filter pencarian
            </p>
            <button 
              onClick={clearSearch}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {filteredProducts.map((product) => {
              // Use image utility to get valid image, skip if in error list
              const productImage = !imageErrors.has(product.id_produk) 
                ? (() => {
                    // Check foto_produk first
                    if (product.foto_produk && product.foto_produk.length > 0) {
                      const validImage = product.foto_produk[0]?.url_foto
                      if (validImage && validImage !== 'null' && validImage !== 'undefined' && validImage.trim() !== '') {
                        return validImage
                      }
                    }
                    // Check foto_utama
                    if (product.foto_utama && product.foto_utama !== 'null' && product.foto_utama !== 'undefined' && product.foto_utama.trim() !== '') {
                      return product.foto_utama
                    }
                    return null
                  })()
                : null
              
              return (
                <Link 
                  href={`/${product.slug}`}
                  key={product.id_produk} 
                  className="bg-white rounded-lg md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary/30 group cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1 shimmer-effect"
                >
                  {/* Product Image */}
                  <div className="relative h-32 md:h-48 bg-gray-100 overflow-hidden">
                    {productImage ? (
                      <Image
                        src={productImage}
                        alt={product.nama_produk}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(product.id_produk)}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full group-hover:scale-110 transition-transform duration-500">
                        <div className="text-gray-400 text-center">
                          <FontAwesomeIcon icon={faShoppingCart} className="text-4xl mb-2 group-hover:text-primary transition-colors duration-300" />
                          <div className="text-sm group-hover:text-primary transition-colors duration-300">Foto Produk</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500"></div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      {product.is_package ? (
                        <div className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 group-hover:bg-blue-200 group-hover:scale-105 transition-all duration-300 shadow-sm">
                          PAKET
                        </div>
                      ) : product.bpom ? (
                        <div className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:scale-105 transition-all duration-300 shadow-sm">
                          BPOM
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-3 md:p-6">
                    {/* Category Badge */}
                    {product.categories && product.categories.length > 0 && (
                      <div 
                        className="inline-flex items-center gap-1 text-xs px-2 md:px-3 py-1 rounded-full mb-2 md:mb-3 transition-all duration-300 group-hover:scale-105 bg-primary/10 text-primary group-hover:bg-primary/20 hover:bg-primary/30 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCategoryClick(product.categories![0].nama_kategori)
                        }}
                      >
                        <FontAwesomeIcon icon={faTag} className="w-3 h-3" />
                        {product.categories[0].nama_kategori}
                      </div>
                    )}
                    
                    {/* Product Name */}
                    <h3 className="text-sm md:text-lg font-semibold text-gray-800 group-hover:text-primary mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] transition-colors duration-300">
                      {product.nama_produk}
                    </h3>
                    
                    {/* Description */}
                    {product.deskripsi_singkat && (
                      <p className="text-gray-600 group-hover:text-gray-700 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 min-h-[2.5rem] md:min-h-[4rem] transition-colors duration-300">
                        {product.deskripsi_singkat}
                      </p>
                    )}
                    
                    {/* Package Contents */}
                    {product.is_package && product.package_contents && product.package_contents.length > 0 && (
                      <div className="mb-3 md:mb-4">
                        <p className="text-xs text-gray-500 mb-1">Isi paket:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                          {product.package_contents.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center">
                              <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                              {item.jumlah}x {item.nama_produk}
                            </div>
                          ))}
                          {product.package_contents.length > 2 && (
                            <div className="text-primary text-xs">
                              +{product.package_contents.length - 2} produk lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="text-lg md:text-xl font-bold text-primary group-hover:text-pink-600 mb-3 md:mb-4 transition-colors duration-300 group-hover:scale-105 transform">
                      {product.harga_umum ? formatPrice(product.harga_umum) : 'Hubungi Kami'}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(`https://wa.me/6285852555571?text=${encodeURIComponent(`Halo, saya tertarik dengan produk ${product.nama_produk}`)}`, '_blank')
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 md:py-3 rounded-lg hover:shadow-lg active:bg-green-700 transition-all duration-300 font-semibold text-xs md:text-sm text-center transform hover:scale-105 active:scale-95 group-hover:animate-pulse"
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-1 group-hover:animate-pulse" />
                        Beli
                      </button>
                      <div className="flex-1 bg-gray-100 text-gray-700 py-2 md:py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 font-semibold text-xs md:text-sm text-center transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1 group-hover:animate-bounce" />
                        Detail
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-800 text-sm font-medium">
              ✅ Menampilkan {filteredProducts.length} dari {products.length} produk
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-2">
            Data produk dimuat langsung dari database PostgreSQL
          </p>
        </div>
      </div>

    </div>
  )
}