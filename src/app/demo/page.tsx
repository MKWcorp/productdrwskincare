'use client'

import React from 'react'
import { DrwSkincareProvider } from '@/components/DrwSkincareProvider'
import { GenericProductList } from '@/components/GenericProductList'
import type { SiteConfig, APIConfig } from '@/types/config'

// Demo configuration
const siteConfig: SiteConfig = {
  name: "DR.W Skincare Demo",
  whatsappNumber: "6285852555571",
  primaryColor: "#ec4899",
  backgroundColor: "#f9fafb",
  features: {
    whatsappIntegration: true,
    productCategories: true,
    productSearch: true,
    priceDisplay: true
  }
}

const apiConfig: APIConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? "https://drwskincarebanyuwangi.com/api"
    : "http://localhost:3000/api",
  version: "v1",
  timeout: 10000,
  endpoints: {
    products: "/products",
    categories: "/categories", 
    product: "/products"
  }
}

export default function GenericDemo() {
  return (
    <DrwSkincareProvider siteConfig={siteConfig} apiConfig={apiConfig}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Generic Components Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Demonstrasi komponen React yang dapat dikonfigurasi untuk berbagai kebutuhan e-commerce skincare.
            </p>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Komponen Generic Features:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Konfigurasi melalui props (tidak ada hardcoded values)</li>
                <li>✅ API endpoint yang dapat dikustomisasi</li>
                <li>✅ WhatsApp integration yang fleksibel</li>
                <li>✅ Theme dan styling yang dapat diubah</li>
                <li>✅ Multi-bahasa dan multi-currency support</li>
                <li>✅ Siap untuk ekstraksi ke NPM package</li>
              </ul>
            </div>
          </header>

          <GenericProductList
            filters={{
              categories: true,
              search: true,
              priceRange: true,
              sortBy: true
            }}
            productsPerPage={12}
            showPagination={true}
            gridColumns={{
              mobile: 1,
              tablet: 2,
              desktop: 3
            }}
            onProductClick={(product) => {
              console.log('Product clicked:', product.nama_produk)
              alert(`Navigating to: /products/${product.slug}`)
            }}
            onCategoryChange={(category) => {
              console.log('Category changed to:', category)
            }}
            emptyStateMessage="Belum ada produk tersedia untuk demo ini"
            className="bg-white rounded-lg shadow-sm p-6"
          />
        </div>
      </div>
    </DrwSkincareProvider>
  )
}