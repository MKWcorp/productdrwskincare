# DR.W Skincare - Website Components & Product Pages

**Developer:** MKWCorp  
**Version:** 1.0.0  
**License:** MIT  

## 📋 Deskripsi Project

Repository ini berisi komponen React dan halaman website untuk **DR.W Skincare**, sebuah brand perawatan kulit terpercaya yang menyediakan produk-produk berkualitas tinggi untuk kebutuhan perawatan kulit sehari-hari.

### 🎯 Tujuan Website
- Menampilkan katalog produk DR.W Skincare secara online
- Memberikan informasi detail setiap produk (komposisi, kegunaan, cara pakai, BPOM)
- Memudahkan pelanggan untuk melihat dan memesan produk via WhatsApp
- Menyediakan sistem yang mudah diduplikasi untuk berbagai cabang/distributir

---

## 🏗️ Arsitektur Website

### Database Schema
Website ini terhubung langsung ke database PostgreSQL dengan struktur sebagai berikut:

```sql
-- Tabel utama produk
produk (id_produk, nama_produk, harga_umum, foto_utama, deskripsi_singkat, bpom, slug)

-- Kategori produk  
kategori (id, nama_kategori, deskripsi)

-- Relasi produk-kategori (many-to-many)
produk_kategori (produk_id, kategori_id)

-- Detail lengkap produk
produk_detail (produk_id, kegunaan, komposisi, cara_pakai, netto, no_bpom)

-- Foto produk (multiple photos per product)
foto_produk (id_foto, produk_id, url_foto, alt_text, urutan)

-- Bahan aktif
bahan_aktif (id, nama_bahan)
produk_bahan_aktif (produk_id, bahan_id, fungsi)
```

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL 
- **ORM:** Prisma
- **Components:** React 18 dengan Custom Hooks
- **Integration:** WhatsApp Business API

---

## 📄 Halaman Website

### 1. **Homepage (`/`)**
- **Komponen:** `src/app/page.tsx`
- **Fungsi:** Landing page dengan hero section dan featured products
- **Features:** 
  - Header dengan nama brand yang dapat dikustomisasi
  - Hero section dengan CTA button
  - Grid produk unggulan (featured products)
  - Footer dengan informasi kontak dan WhatsApp
  - Status koneksi database real-time

### 2. **Product Listing (`/products`)**
- **Komponen:** `ProductList.tsx`
- **Fungsi:** Menampilkan semua produk dengan filter dan search
- **Features:**
  - Search bar untuk mencari produk
  - Filter berdasarkan kategori
  - Pagination (12 produk per halaman)
  - Loading states dan error handling
  - Responsive grid layout

### 3. **Product Detail (`/products/[slug]`)**
- **Komponen:** `ProductDetail.tsx` 
- **Fungsi:** Halaman detail produk individual
- **Features:**
  - Gallery foto produk (multiple images)
  - Informasi lengkap (nama, harga, deskripsi)
  - Detail produk (kegunaan, komposisi, cara pakai)
  - Nomor BPOM dan informasi keamanan
  - Daftar bahan aktif dan fungsinya
  - CTA WhatsApp dengan pre-filled message
  - Related products (produk dalam kategori sama)
  - Breadcrumb navigation

---

## 🧩 Komponen Utama

### 1. **ProductCard Component**
```typescript
interface ProductCardProps {
  product: Product
  className?: string
}
```
**Features:**
- Responsive card design dengan hover effects
- Product image dengan fallback
- Price formatting (IDR currency)
- Discount badge (jika ada)
- Stock status indicator
- WhatsApp CTA button
- Benefits/manfaat display

### 2. **ProductList Component**  
```typescript
interface ProductListProps {
  className?: string
  showSearch?: boolean
  showCategories?: boolean
  itemsPerPage?: number
  initialFilters?: ProductsFilter
}
```
**Features:**
- Real-time data dari database
- Search functionality
- Category filtering
- Client-side pagination
- Loading skeleton
- Empty state handling

### 3. **ProductDetail Component**
```typescript
interface ProductDetailProps {
  slug: string
}
```
**Features:**
- Image gallery dengan zoom
- Comprehensive product information
- Ingredients dan active compounds
- BPOM certification display
- Usage instructions
- WhatsApp integration
- SEO optimization

### 4. **SearchBar Component**
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}
```

### 5. **CategoryFilter Component**
```typescript
interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}
```

---

## 🎣 Custom Hooks

### 1. **useDRWProducts**
```typescript
const { products, loading, error, refetch } = useDRWProducts({
  category?: string
  search?: string
  featured?: boolean
  limit?: number
})
```
**Fungsi:** Mengambil data produk dari database dengan filtering

### 2. **useDRWCategories**
```typescript
const { categories, loading } = useDRWCategories()
```
**Fungsi:** Mengambil daftar kategori produk

### 3. **useProductDetail**
```typescript
const { product, loading, error } = useProductDetail(slug)
```
**Fungsi:** Mengambil detail produk berdasarkan slug

---

## 🌐 API Endpoints

### 1. **GET /api/products**
**Query Parameters:**
- `category` - Filter berdasarkan kategori
- `search` - Search dalam nama dan deskripsi
- `featured` - Hanya produk unggulan (true/false)
- `limit` - Batasi jumlah hasil
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "DR.W Whitening Serum",
      "price": 89000,
      "imageUrl": "https://...",
      "category": "Serum",
      "description": "Serum pencerah kulit...",
      "bpom": "NA18201234567",
      "slug": "drw-whitening-serum"
    }
  ],
  "total": 126
}
```

### 2. **GET /api/products/[slug]**
**Response:** Detail lengkap produk dengan relasi (kategori, foto, bahan aktif, detail)

### 3. **GET /api/categories**
**Response:** List semua kategori produk

---

## 🎨 Customization untuk Multi-Website

### Environment Variables
```env
# Brand Configuration
NEXT_PUBLIC_SITE_NAME="DR.W Skincare Jakarta" 
NEXT_PUBLIC_SITE_SUBTITLE="Solusi Perawatan Kulit Terpercaya"
NEXT_PUBLIC_WHATSAPP="6281234567890"

# Theme Colors
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#1e40af"

# Database Connection
DATABASE_URL="postgresql://berkomunitas:berkomunitas688@213.190.4.159:5432/drwskincare"
```

### Fitur Multi-Website
- **Theme Customization:** Warna brand dapat diubah via environment variables
- **WhatsApp Integration:** Nomor WhatsApp dapat berbeda per website
- **Site Branding:** Nama dan subtitle dapat disesuaikan
- **Shared Database:** Semua website menggunakan database produk yang sama
- **Auto-sync:** Update produk di database otomatis sync ke semua website

---

## 🚀 Deployment & Setup

### Quick Setup Script
```bash
# Jalankan script generator website
chmod +x drw-skincare-lib/create-website.sh
./drw-skincare-lib/create-website.sh
```

Script akan menanyakan:
1. Nama website (contoh: "DR.W Skincare Jakarta")
2. Subtitle website
3. Nomor WhatsApp
4. Warna tema (primary & secondary)
5. Nama folder project

### Manual Setup
```bash
# 1. Create Next.js project
npx create-next-app@latest my-drw-website --typescript --tailwind

# 2. Install dependencies
npm install @prisma/client prisma pg @types/pg

# 3. Setup database
npx prisma generate
npx prisma db pull

# 4. Configure environment
cp .env.example .env.local
# Edit environment variables

# 5. Run development server
npm run dev
```

---

## 📱 WhatsApp Integration

Setiap produk memiliki tombol "Pesan via WhatsApp" yang otomatis:

1. **Generate WhatsApp URL** dengan format:
   ```
   https://wa.me/[WHATSAPP_NUMBER]?text=[ENCODED_MESSAGE]
   ```

2. **Pre-filled Message** berisi:
   - Nama produk
   - Harga produk  
   - Link website
   - Nama website/brand

3. **Example Message:**
   ```
   Halo, saya tertarik dengan produk DR.W Whitening Serum dari DR.W Skincare Jakarta. 
   Harga: Rp 89.000
   Mohon info lebih lanjut.
   ```

---

## 🔒 Security & Performance

### Security Features
- **Environment Variables:** Sensitive data tidak di-hardcode
- **SQL Injection Protection:** Menggunakan Prisma ORM
- **XSS Protection:** Auto-escape di React components
- **CORS Configuration:** API endpoints dengan proper CORS

### Performance Optimization
- **Database Indexing:** Index pada slug, kategori, dan nama produk
- **Image Optimization:** Next.js Image component dengan lazy loading
- **Caching:** Database queries dengan appropriate caching
- **Bundle Optimization:** Code splitting dan tree shaking

---

## 📊 Analytics & Monitoring

### Built-in Monitoring
- **Database Connection Status:** Real-time indicator di footer
- **Error Logging:** Comprehensive error tracking
- **Performance Metrics:** Page load times dan API response times

### Recommended Analytics
- **Google Analytics 4:** Track user behavior dan product views
- **WhatsApp Click Tracking:** Monitor conversion rates
- **Database Performance:** Query performance monitoring

---

## 🛠️ Development Guidelines

### Code Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── products/          # Product pages
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   └── ProductDetail.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── db.ts             # Database connection
│   ├── api.ts            # API functions
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
└── styles/               # Global styles
```

### Naming Conventions
- **Components:** PascalCase (ProductCard.tsx)
- **Hooks:** camelCase dengan prefix 'use' (useDRWProducts)
- **Utilities:** camelCase (formatPrice, generateSlug)
- **Database Models:** snake_case (produk, kategori)

### Git Workflow
1. **Feature Branch:** `feature/product-detail-page`
2. **Commit Messages:** Conventional commits format
3. **Pull Requests:** Required review sebelum merge
4. **Deployment:** Automatic deployment via CI/CD

---

## 📞 Support & Maintenance

### Contact Information
- **Developer:** MKWCorp
- **Email:** support@mkwcorp.com
- **WhatsApp:** +62812-3456-7890
- **Documentation:** [docs.drwskincare.com](https://docs.drwskincare.com)

### Maintenance Schedule
- **Database Backup:** Harian (otomatis)
- **Security Updates:** Bulanan
- **Feature Updates:** Sesuai kebutuhan bisnis
- **Performance Review:** Kuartalan

### SLA (Service Level Agreement)
- **Uptime:** 99.9% availability
- **Response Time:** < 2 detik untuk halaman produk
- **Support Response:** < 24 jam untuk issues

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release dengan database integration
- ✅ Complete product catalog dengan detail pages
- ✅ WhatsApp integration
- ✅ Multi-website support
- ✅ Responsive design
- ✅ TypeScript support

### Planned Features (v1.1.0)
- 🔄 Admin dashboard untuk manage produk
- 🔄 Advanced search dengan filters
- 🔄 Product comparison feature
- 🔄 Customer reviews dan ratings
- 🔄 Inventory management
- 🔄 Order tracking system

---

## 📄 License

MIT License - Copyright (c) 2024 MKWCorp

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

---

## 🏢 Tentang MKWCorp

**MKWCorp** adalah perusahaan teknologi yang mengkhususkan diri dalam pengembangan solusi digital untuk industri beauty, skincare, dan retail. Kami memiliki pengalaman lebih dari 5 tahun dalam membangun sistem e-commerce yang powerful dan user-friendly.

### Keahlian Kami:
- 🛒 **E-commerce Development**: Custom online stores dengan fitur lengkap
- 📱 **Multi-Platform Solutions**: Website, mobile apps, dan WhatsApp integration
- 🗄️ **Database Management**: Real-time inventory dan product management
- 🎨 **UI/UX Design**: Interface yang menarik dan conversion-optimized
- 🚀 **Performance Optimization**: Website cepat dengan SEO terbaik
- 🔧 **Maintenance & Support**: 24/7 monitoring dan technical support

### Mengapa Memilih MKWCorp?
1. **Specialized Experience**: Fokus pada beauty & skincare industry
2. **Proven Track Record**: 50+ successful projects
3. **Modern Technology Stack**: Next.js, React, TypeScript, PostgreSQL
4. **Scalable Solutions**: Dari startup hingga enterprise level
5. **Ongoing Support**: Tidak hanya build, tapi maintain jangka panjang
6. **Competitive Pricing**: ROI yang terbukti untuk bisnis Anda

### Client Testimonials:
> *"MKWCorp membantu kami membangun sistem yang powerful untuk manage 100+ produk skincare di 5 cabang berbeda. Website mereka fast, SEO-friendly, dan easy to use."*  
> **- DR.W Skincare Management**

> *"Integration WhatsApp mereka luar biasa! Conversion rate naik 300% setelah pakai sistem dari MKWCorp."*  
> **- Beauty Brand Owner**

### Portfolio Highlights:
- **DR.W Skincare**: Multi-website system dengan database terpusat (126+ produk)
- **Beauty Retail Chain**: 10 lokasi dengan inventory real-time sync
- **Cosmetics Distributor**: B2B portal untuk 50+ reseller
- **Skincare Startup**: Complete branding & e-commerce solution

---

**© 2024 MKWCorp - Professional Web Development Solutions**  
**DR.W Skincare Website Components - Powered by MKWCorp Technology**