# DR.W Skincare React Components

Koleksi komponen React yang dapat digunakan kembali untuk aplikasi e-commerce skincare. Komponen-komponen ini sepenuhnya dikonfigurasi melalui props dan tidak memiliki nilai hardcoded.

## Instalasi

```bash
npm install @drwskincare/react-components
```

## Dependencies

Komponen ini membutuhkan dependency berikut:

```bash
npm install react react-dom @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

## Penggunaan Dasar

### 1. Setup Provider

Bungkus aplikasi Anda dengan `DrwSkincareProvider`:

```tsx
import React from 'react'
import { DrwSkincareProvider } from '@drwskincare/react-components'
import type { SiteConfig, APIConfig } from '@drwskincare/react-components'

const siteConfig: SiteConfig = {
  name: "Toko Skincare Saya",
  whatsappNumber: "6281234567890",
  primaryColor: "#10B981",
  backgroundColor: "#F9FAFB",
  features: {
    whatsappIntegration: true,
    productCategories: true
  }
}

const apiConfig: APIConfig = {
  baseUrl: "https://api.tokoskincare.com",
  version: "v1",
  endpoints: {
    products: "/products",
    categories: "/categories",
    product: "/products"
  }
}

function App() {
  return (
    <DrwSkincareProvider siteConfig={siteConfig} apiConfig={apiConfig}>
      {/* Komponen aplikasi Anda */}
    </DrwSkincareProvider>
  )
}
```

### 2. Menggunakan Product Card

```tsx
import React from 'react'
import { GenericProductCard } from '@drwskincare/react-components'

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <GenericProductCard
          key={product.id}
          product={product}
          onProductClick={(product) => {
            // Navigate ke detail produk
            router.push(`/products/${product.slug}`)
          }}
          onWhatsAppClick={(product) => {
            // Custom WhatsApp handler (opsional)
            console.log('WhatsApp clicked for:', product.nama_produk)
          }}
          showBPOM={true}
          showCategories={true}
          customButtonText="Beli Sekarang"
        />
      ))}
    </div>
  )
}
```

### 3. Menggunakan Product List dengan Filter

```tsx
import React from 'react'
import { GenericProductList } from '@drwskincare/react-components'

function ProductsPage() {
  return (
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
        router.push(`/products/${product.slug}`)
      }}
      onCategoryChange={(category) => {
        console.log('Category changed to:', category)
      }}
    />
  )
}
```

### 4. Menggunakan Product Detail

```tsx
import React from 'react'
import { GenericProductDetail } from '@drwskincare/react-components'

function ProductDetailPage({ slug }) {
  return (
    <GenericProductDetail
      slug={slug}
      onProductLoad={(product) => {
        // Update SEO metadata
        document.title = product.nama_produk
      }}
      onProductNotFound={() => {
        // Custom 404 handling
        router.push('/404')
      }}
      showRelatedProducts={true}
      relatedProductsLimit={3}
      customWhatsAppMessage={(product) => {
        return `Halo, saya tertarik dengan ${product.nama_produk}. Mohon info lebih lanjut.`
      }}
    />
  )
}
```

## Konfigurasi

### Site Configuration

```tsx
interface SiteConfig {
  name: string                    // Nama toko/brand
  whatsappNumber: string         // Nomor WhatsApp dengan kode negara
  primaryColor?: string          // Warna primary (default: #10B981)
  backgroundColor?: string       // Background color (default: #F9FAFB)
  features?: {
    whatsappIntegration?: boolean    // Enable WhatsApp integration
    productCategories?: boolean      // Show product categories
    productSearch?: boolean          // Enable product search
    priceDisplay?: boolean          // Show product prices
  }
}
```

### API Configuration

```tsx
interface APIConfig {
  baseUrl: string               // Base URL API
  version?: string             // API version (default: v1)
  timeout?: number            // Timeout in ms (default: 10000)
  headers?: Record<string, string>  // Custom headers
  endpoints?: {
    products?: string         // Products endpoint (default: /products)
    categories?: string       // Categories endpoint (default: /categories)
    product?: string         // Single product endpoint (default: /products)
  }
}
```

## Format Data Product

Komponen mengharapkan data produk dengan format berikut:

```tsx
interface DatabaseProduct {
  id: string
  nama_produk: string
  slug: string
  harga_umum: number
  foto_utama?: string
  deskripsi_singkat?: string
  bpom?: string
  kegunaan?: string
  komposisi?: string
  cara_pakai?: string
  netto?: string
  bahan_aktif?: Array<{
    nama_bahan: string
    fungsi?: string
  }>
  foto_produk?: Array<{
    url_foto: string
    alt_text?: string
    urutan: number
  }>
  categories?: Array<{
    id: string
    nama_kategori: string
  }>
}
```

## Custom Styling

Komponen menggunakan Tailwind CSS. Anda dapat mengoverride styling dengan:

1. **Custom Props**: Banyak komponen menerima `className` prop
2. **CSS Variables**: Override CSS variables untuk theme
3. **Tailwind Override**: Gunakan Tailwind classes dengan higher specificity

```tsx
<GenericProductCard
  product={product}
  className="shadow-xl hover:shadow-2xl"
/>
```

## Utilitas

### Format Price

```tsx
import { formatPrice } from '@drwskincare/react-components'

const formattedPrice = formatPrice(150000, 'IDR', 'id-ID')
// Output: "Rp 150.000"
```

### WhatsApp Message

```tsx
import { createWhatsAppMessage } from '@drwskincare/react-components'

const message = createWhatsAppMessage(
  "Serum Vitamin C",
  150000,
  "6281234567890",
  "Toko Skincare",
  { bpom: "NA18200100123" }
)
```

### Build API URL

```tsx
import { buildApiUrl } from '@drwskincare/react-components'

const url = buildApiUrl('/products', apiConfig)
// Output: "https://api.tokoskincare.com/v1/products"
```

## TypeScript Support

Semua komponen memiliki definisi TypeScript lengkap. Import types yang dibutuhkan:

```tsx
import type { 
  SiteConfig, 
  APIConfig, 
  ComponentConfig,
  DatabaseProduct 
} from '@drwskincare/react-components'
```

## Advanced Usage

### Custom Product Card

```tsx
import React from 'react'
import { GenericProductList } from '@drwskincare/react-components'

const CustomProductCard = ({ product }) => (
  <div className="custom-product-card">
    <h3>{product.nama_produk}</h3>
    <p>Rp {product.harga_umum?.toLocaleString('id-ID')}</p>
  </div>
)

function ProductsWithCustomCard() {
  return (
    <GenericProductList
      customProductCard={CustomProductCard}
      // ... other props
    />
  )
}
```

### Custom Tabs in Product Detail

```tsx
import { GenericProductDetail } from '@drwskincare/react-components'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const customTabs = [
  {
    id: 'description',
    label: 'Deskripsi',
    icon: faHeart,
    content: (product) => (
      <div>
        <h3>Deskripsi Produk</h3>
        <p>{product.deskripsi_singkat}</p>
      </div>
    )
  }
]

function ProductDetailWithCustomTabs({ slug }) {
  return (
    <GenericProductDetail
      slug={slug}
      customTabs={customTabs}
    />
  )
}
```

## Contoh Lengkap

Lihat folder `examples/` untuk contoh aplikasi lengkap menggunakan komponen ini.

## Contributing

1. Fork repository
2. Buat branch feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT © DR.W Skincare