import React from 'react';
import { ProductList } from './lib';
import type { DrwProductConfig } from './lib';

// Demo configuration
const demoConfig: Partial<DrwProductConfig> = {
  apiBaseUrl: 'https://drwskincarebanyuwangi.com/api',
  whatsappNumber: '6285852555571',
  brandName: 'DRW Skincare',
  currency: 'IDR',
  priceRole: 'umum',
  enablePackages: true,
  enableCategories: true,
};

// Mock products for demo
const mockProducts = [
  {
    id_produk: 1,
    nama_produk: 'Acne Cream Demo',
    slug: 'acne-cream-demo',
    bpom: 'NA18210100123',
    harga_umum: 50000,
    foto_utama: '/logo_drwskincare_square.png',
    deskripsi_singkat: 'Cream untuk mengatasi jerawat dan bekasnya',
    produk_kategori: [{
      produk_id: 1,
      kategori_id: 1,
      kategori: {
        id: 1,
        nama_kategori: 'Face Care',
        deskripsi: 'Perawatan wajah'
      }
    }],
    produk_detail: {
      produk_id: 1,
      kegunaan: 'Mengatasi jerawat aktif dan mencegah jerawat baru',
      cara_pakai: 'Gunakan tipis-tipis pada area berjerawat setelah membersihkan wajah',
      komposisi: 'Salicylic acid, niacinamide, tea tree oil',
      netto: '15g'
    }
  },
  {
    id_produk: 2,
    nama_produk: 'Serum Vitamin C Demo',
    slug: 'serum-vitamin-c-demo',
    bpom: 'NA18210100456',
    harga_umum: 75000,
    foto_utama: '/logo_drwskincare_square.png',
    deskripsi_singkat: 'Serum untuk mencerahkan dan melindungi kulit',
    type: 'product',
    produk_kategori: [{
      produk_id: 2,
      kategori_id: 2,
      kategori: {
        id: 2,
        nama_kategori: 'Serum',
        deskripsi: 'Perawatan intensive'
      }
    }]
  },
  {
    id_paket: 1,
    nama_paket: 'Paket Acne Care Demo',
    slug: 'paket-acne-care-demo',
    harga_umum: 120000,
    foto_utama: '/logo_drwskincare_square.png',
    deskripsi: 'Paket lengkap untuk mengatasi masalah jerawat',
    type: 'package',
    packageContents: [
      { nama_produk: 'Acne Cream', id: 1 },
      { nama_produk: 'Cleanser Anti Acne', id: 3 },
      { nama_produk: 'Toner Clarifying', id: 4 }
    ]
  }
] as any[];

function App() {
  const handleWhatsAppClick = (product: unknown) => {
    console.log('WhatsApp clicked for:', product);
    // In real app, this would open WhatsApp
    const prod = product as { nama_produk?: string; nama_paket?: string };
    alert(`WhatsApp untuk produk: ${prod.nama_produk || prod.nama_paket}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    console.log('Category clicked:', categoryName);
    alert(`Filter kategori: ${categoryName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            DRW Product Components Demo
          </h1>
          <p className="text-gray-600 mt-2">
            Reusable product components library for DRW Skincare websites
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Demo with mock data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Product List Component (Mock Data)
            </h2>
            <ProductList
              products={mockProducts}
              config={demoConfig}
              onWhatsAppClick={handleWhatsAppClick}
              onCategoryClick={handleCategoryClick}
              enableSearch={true}
              enableFilters={true}
            />
          </section>

          {/* Demo with real API (if available) */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Product List Component (Live API)
            </h2>
            <p className="text-gray-600 mb-4">
              This will connect to the real API if available:
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> To test with live API, make sure the API endpoint is accessible 
                and CORS is properly configured.
              </p>
            </div>
          </section>

          {/* Usage Documentation */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Usage Example
            </h2>
            <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
              <pre>{`import { ProductListWithData, DrwProductConfig } from '@drw/product-components';
import '@drw/product-components/styles';

const config: Partial<DrwProductConfig> = {
  apiBaseUrl: '/api',
  whatsappNumber: '6285852555571',
  priceRole: 'umum',
};

function MyApp() {
  return (
    <ProductListWithData
      config={config}
      onWhatsAppClick={(product) => {
        // Handle WhatsApp click
      }}
      onCategoryClick={(category) => {
        // Handle category filter
      }}
      enableSearch={true}
      enableFilters={true}
    />
  );
}`}</pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
