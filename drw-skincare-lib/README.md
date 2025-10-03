# DR.W Skincare Components Library

**Created by MKWCorp**

Library komponen React dan integrasi database untuk website DR.W Skincare yang dapat dengan mudah digunakan di berbagai website.

## 🏢 About MKWCorp

MKWCorp adalah developer yang mengkhususkan diri dalam pembuatan website e-commerce dan sistem katalog produk untuk brand skincare dan kosmetik. Kami menyediakan solusi teknologi yang memungkinkan brand untuk:

- **Multi-Website Management**: Satu database, banyak website
- **Real-time Sync**: Update produk otomatis tersync ke semua website
- **WhatsApp Integration**: Sistem pemesanan terintegrasi WhatsApp Business
- **SEO Optimized**: Website yang dioptimalkan untuk mesin pencari
- **Mobile Responsive**: Design yang sempurna di semua device

## Features

✅ **Database Integration** - Koneksi langsung ke database PostgreSQL DR.W Skincare  
✅ **React Components** - Komponen siap pakai dengan Tailwind CSS  
✅ **TypeScript Support** - Full type safety  
✅ **Responsive Design** - Mobile-first design  
✅ **WhatsApp Integration** - Otomatis generate link WhatsApp  
✅ **Multi-Website Support** - Konfigurasi mudah untuk berbagai website  

## Quick Start

### 1. Installation

```bash
npm install @drw-skincare/components
# atau
yarn add @drw-skincare/components
```

### 2. Setup Environment Variables

Buat file `.env.local` di project Anda:

```env
# Database DR.W Skincare
DATABASE_URL="postgresql://berkomunitas:berkomunitas688@213.190.4.159:5432/drwskincare"

# Konfigurasi Website
NEXT_PUBLIC_SITE_NAME="DR.W Skincare Banyuwangi"
NEXT_PUBLIC_SITE_SUBTITLE="Solusi Perawatan Kulit Terpercaya"
NEXT_PUBLIC_WHATSAPP="6281234567890"
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#1e40af"
```

### 3. Import dan Gunakan

```tsx
import { ProductList, ProductCard, useDRWProducts } from '@drw-skincare/components'

export default function HomePage() {
  return (
    <div>
      <h1>Produk DR.W Skincare</h1>
      <ProductList 
        showSearch={true}
        showCategories={true}
        itemsPerPage={12}
      />
    </div>
  )
}
```

## 🧩 Components Overview

### Website Pages & Routing

#### 1. Homepage (`/`)
- **File**: `src/app/page.tsx`
- **Description**: Landing page dengan hero section dan featured products
- **Features**: Brand header, CTA buttons, product showcase, WhatsApp integration

#### 2. Product Listing (`/products`)
- **File**: `src/app/products/page.tsx` 
- **Description**: Halaman daftar semua produk dengan filtering
- **Features**: Search, category filter, pagination, real-time data

#### 3. Product Detail (`/products/[slug]`)
- **File**: `src/app/products/[slug]/page.tsx`
- **Description**: Halaman detail produk individual dengan slug routing
- **Features**: 
  - **Gallery**: Multiple product images dengan thumbnail navigation
  - **Product Info**: Nama, harga, deskripsi lengkap, stock status
  - **BPOM Certificate**: Nomor registrasi dan validasi keamanan
  - **Detailed Information**: Kegunaan, komposisi, cara pakai, netto
  - **Active Ingredients**: Daftar bahan aktif dan fungsinya
  - **WhatsApp CTA**: Pre-filled message dengan detail produk
  - **Related Products**: Produk dalam kategori yang sama
  - **SEO Optimization**: Meta tags, Open Graph, structured data
  - **Breadcrumb Navigation**: Easy navigation hierarchy

### React Components

### ProductList
Komponen untuk menampilkan daftar produk dengan fitur search dan filter kategori.

```tsx
<ProductList 
  showSearch={true}
  showCategories={true}
  itemsPerPage={12}
  initialFilters={{ category: 'Serum' }}
/>
```

### ProductCard
Komponen untuk menampilkan satu produk.

```tsx
<ProductCard 
  product={product}
  className="shadow-lg"
/>
```

### useDRWProducts Hook
Hook untuk mengambil data produk dari database.

```tsx
const { products, loading, error } = useDRWProducts({
  category: 'Serum',
  search: 'whitening',
  limit: 10
})
```

## Database Schema

Library ini menggunakan database PostgreSQL dengan schema sebagai berikut:

- `produk` - Data produk utama
- `kategori` - Kategori produk  
- `produk_kategori` - Relasi produk-kategori
- `produk_detail` - Detail produk (kegunaan, komposisi, cara pakai)
- `foto_produk` - Foto-foto produk
- `bahan_aktif` - Bahan aktif produk

## Customization

### Theme Colors
Ubah warna tema melalui environment variables:

```env
NEXT_PUBLIC_PRIMARY_COLOR="#ff6b6b"    # Warna utama
NEXT_PUBLIC_SECONDARY_COLOR="#4ecdc4"  # Warna sekunder
```

### WhatsApp Integration
Set nomor WhatsApp untuk pemesanan:

```env
NEXT_PUBLIC_WHATSAPP="6281234567890"
```

## Website Duplication

Untuk membuat website baru dengan library ini:

1. **Clone Template Project**
```bash
git clone <template-repo>
cd new-website
```

2. **Update Environment Variables**
```env
NEXT_PUBLIC_SITE_NAME="DR.W Skincare Jakarta"
NEXT_PUBLIC_WHATSAPP="6281234567891"
NEXT_PUBLIC_PRIMARY_COLOR="#8b5cf6"
```

3. **Deploy**
```bash
npm run build
npm run start
```

## 🔗 Slug-Based Product Routing

### How Slugs Work
Setiap produk memiliki slug unik yang digunakan untuk URL SEO-friendly:

```
Produk: "DR.W Whitening Serum Advanced Formula"
Slug: "drw-whitening-serum-advanced-formula"
URL: "https://yoursite.com/products/drw-whitening-serum-advanced-formula"
```

### Slug Generation
Slug otomatis dibuat dari nama produk dengan aturan:
- Huruf kecil semua (lowercase)
- Spasi diganti dengan tanda hubung (-)
- Karakter khusus dihilangkan
- Unik untuk setiap produk

### Dynamic Routing
Next.js menggunakan file `[slug].tsx` untuk dynamic routing:

```typescript
// File: src/app/products/[slug]/page.tsx
export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />
}
```

### SEO Benefits
- **User-Friendly URLs**: Mudah dibaca dan diingat
- **Search Engine Optimization**: URL yang descriptive untuk SEO
- **Social Media Sharing**: URL yang menarik saat di-share
- **Analytics Tracking**: Mudah track halaman produk individual

### Static Generation
Website dapat generate static pages untuk performa optimal:

```typescript
export async function generateStaticParams() {
  const products = await prisma.produk.findMany({
    select: { slug: true }
  })
  
  return products.map((product) => ({
    slug: product.slug
  }))
}
```

## Advanced Usage

### Custom Product Filter
```tsx
const { products } = useDRWProducts({
  category: 'Serum',
  search: 'vitamin c',
  featured: true,
  limit: 6
})
```

### Multiple Categories
```tsx
const { products } = useDRWProducts({
  categories: ['Serum', 'Moisturizer', 'Cleanser']
})
```

### Server-Side Rendering
```tsx
// pages/products.tsx
export async function getServerSideProps() {
  const { getProductsFromDB } = await import('@drw-skincare/components/database')
  
  const response = await getProductsFromDB({
    limit: 20,
    category: 'Serum'
  })
  
  return {
    props: {
      initialProducts: response.data
    }
  }
}
```

## API Endpoints

Library ini menyediakan API endpoints siap pakai:

- `GET /api/products` - Ambil daftar produk
- `GET /api/categories` - Ambil daftar kategori
- `GET /api/products/[slug]` - Ambil detail produk

## TypeScript Support

```tsx
import type { Product, ProductsFilter } from '@drw-skincare/components'

const product: Product = {
  id: '1',
  name: 'DR.W Whitening Serum',
  price: 89000,
  category: 'Serum'
  // ... other properties
}
```

## Examples

Lihat folder `examples/` untuk contoh implementasi lengkap:

- `examples/basic-website` - Website sederhana
- `examples/multi-brand` - Website multi-brand
- `examples/custom-theme` - Custom theme
- `examples/with-cms` - Integrasi dengan CMS

## Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🏢 MKWCorp Services

### Web Development Services
- **Custom E-commerce Websites**: Katalog produk dengan database integration
- **Multi-Brand Solutions**: Satu sistem untuk multiple brand/cabang
- **WhatsApp Business Integration**: Automated ordering system
- **SEO & Digital Marketing**: Website optimization untuk ranking Google
- **Mobile App Development**: iOS & Android apps untuk brand Anda
- **Database Management**: PostgreSQL, MySQL, MongoDB solutions
- **Cloud Hosting & Maintenance**: AWS, Google Cloud, dedicated servers

### Specialization
- **Skincare & Cosmetics Brands**: 5+ tahun pengalaman
- **Retail & E-commerce**: Online catalog dan inventory management  
- **Multi-Location Businesses**: Franchise dan distributor systems
- **WhatsApp Commerce**: Integration dengan WhatsApp Business API

### Portfolio
- **DR.W Skincare**: Multi-website system dengan 126+ produk
- **Beauty Brands**: 10+ brand skincare dan kosmetik
- **Retail Chains**: Multi-location inventory management
- **Distributor Networks**: B2B portal dan ordering systems

## Support & Contact

### Technical Support
- 📧 Email: dev@mkwcorp.com
- 💬 WhatsApp: +62812-3456-7890
- 🌐 Website: [mkwcorp.com](https://mkwcorp.com)
- 📚 Documentation: [docs.mkwcorp.com](https://docs.mkwcorp.com)

### Business Inquiries
- 📧 Business: business@mkwcorp.com
- 📱 WhatsApp Business: +62811-2345-6789
- 📍 Office: Jakarta, Indonesia
- 🕒 Support Hours: 09:00 - 18:00 WIB (Mon-Fri)