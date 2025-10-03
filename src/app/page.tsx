"use client"

import { ProductList } from "@/components/ProductList"
import { siteConfig, getThemeColors } from "@/lib/config"
import { useProducts } from "@/hooks/useProducts"

export default function Home() {
  const themeColors = getThemeColors()
  
  // Fetch featured products for hero section
  const { products: featuredProducts, loading: featuredLoading } = useProducts({ 
    featured: true, 
    limit: 3 
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: themeColors.primary }}
            >
              {siteConfig.name}
            </h1>
            <p className="text-gray-600 text-lg">
              {siteConfig.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {siteConfig.hero.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              {siteConfig.hero.subtitle}
            </p>
            <button 
              className="px-8 py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: themeColors.primary }}
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ 
                  behavior: 'smooth' 
                })
              }}
            >
              {siteConfig.hero.ctaText}
            </button>
          </div>

          {/* Featured Products Preview */}
          {!featuredLoading && featuredProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Produk Unggulan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: `${themeColors.primary}20` }}>
                        <span className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                          {product.nama_produk.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">{product.nama_produk}</h4>
                      <p className="text-sm text-gray-600 mb-3">{product.deskripsi_singkat}</p>
                      <p className="font-bold" style={{ color: themeColors.primary }}>
                        Rp {product.harga_umum.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductList 
            showSearch={siteConfig.features.search}
            showCategories={siteConfig.features.categories}
          />
        </div>
      </section>

      {/* Database Connection Status */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-800 text-sm font-medium">
                ✅ Terhubung ke Database PostgreSQL
              </span>
            </div>
            <p className="text-gray-600 text-xs mt-2">
              Data produk dimuat langsung dari database drwskincare
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 
                className="text-xl font-bold"
                style={{ color: themeColors.primary }}
              >
                {siteConfig.name}
              </h3>
              <p className="text-gray-600">
                {siteConfig.description}
              </p>
              <div className="flex space-x-4">
                <a 
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Kontak</h4>
              <div className="space-y-2 text-gray-600">
                <p>📞 WhatsApp: {siteConfig.whatsapp}</p>
                <p>✉️ Email: {siteConfig.email}</p>
                <p>📍 {siteConfig.address}</p>
              </div>
            </div>

            {/* Database Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">Sistem</h4>
              <div className="space-y-2 text-gray-600">
                <p>🗄️ Database: PostgreSQL</p>
                <p>⚡ Real-time Data</p>
                <p>🔄 Auto-sync Products</p>
                <p>📊 Live Inventory</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-gray-600">
            <p>&copy; 2024 {siteConfig.name}. All rights reserved.</p>
            <p className="text-xs mt-1">Powered by Next.js + PostgreSQL</p>
          </div>
        </div>
      </footer>
    </div>
  )
}