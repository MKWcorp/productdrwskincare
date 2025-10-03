# DR.W Skincare Product Display System

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)

Sistem tampilan produk e-commerce modern untuk DR.W Skincare dengan komponen React yang dapat dikonfigurasi dan siap untuk ekstraksi sebagai NPM package.

## 🚀 Features

### ✅ Core System
- **Modern Product Display**: Homepage dengan grid produk responsive
- **Category Filtering**: Filter produk berdasarkan kategori
- **Package Integration**: Sistem paket produk terintegrasi
- **Dynamic Routing**: Routing otomatis untuk produk
- **FontAwesome Icons**: Icons profesional menggantikan emoji
- **Safe Image Handling**: Komponen SafeImage untuk mengatasi null images
- **Connection Pool Optimization**: Optimasi database dengan retry mechanism

### ✅ Generic Components (NPM Ready)
- **Configurable Components**: Semua komponen menerima konfigurasi via props
- **No Hardcoded Values**: Tidak ada lagi `siteName`, `whatsappNumber` yang hardcoded
- **Multi-API Support**: API endpoints yang dapat dikustomisasi
- **Theme Customization**: Warna, font, dan styling yang fleksibel
- **Multi-language Ready**: Support berbagai locale dan currency
- **TypeScript Full**: Type safety dan IntelliSense lengkap

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, FontAwesome Icons
- **Database**: PostgreSQL dengan Prisma ORM
- **Build System**: Rollup (untuk NPM package)
- **Development**: ESLint, PostCSS

## 📦 Project Structure

```
productdrwskincare/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   ├── demo/                     # Generic components demo
│   │   └── [category]/               # Dynamic category pages
│   ├── components/                   # React Components
│   │   ├── DrwSkincareProvider.tsx   # Context provider
│   │   ├── GenericProductCard.tsx    # Generic product card
│   │   ├── GenericProductDetail.tsx  # Generic product detail
│   │   ├── GenericProductList.tsx    # Generic product list
│   │   ├── ProductCard.tsx           # Original product card
│   │   ├── ProductDetail.tsx         # Original product detail
│   │   ├── ProductList.tsx           # Original product list
│   │   └── SafeImage.tsx             # Safe image component
│   ├── lib/                          # Utilities & NPM Package
│   │   ├── drw-skincare-components.ts # NPM package exports
│   │   ├── generic-utils.ts          # Generic utility functions
│   │   ├── hooks.ts                  # Generic React hooks
│   │   ├── package.json              # NPM package config
│   │   └── README.md                 # NPM package documentation
│   ├── types/                        # TypeScript definitions
│   │   ├── config.ts                 # Configuration types
│   │   └── index.ts                  # Database types
│   └── styles/                       # Global styles
├── prisma/                           # Database schema
├── public/                           # Static assets
├── rollup.config.js                  # Build configuration
└── README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm atau yarn

### Installation

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/drw_skincare"

# Site Configuration
NEXT_PUBLIC_SITE_NAME="DR.W Skincare"
NEXT_PUBLIC_WHATSAPP_NUMBER="6285852555571"
NEXT_PUBLIC_API_BASE_URL="https://drwskincarebanyuwangi.com/api"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Development

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📱 Usage Examples

### Original Components (Legacy)

```tsx
import { ProductList } from '@/components/ProductList'

export default function HomePage() {
  return <ProductList />
}
```

### Generic Components (NPM Ready)

```tsx
import { DrwSkincareProvider, GenericProductList } from '@/lib/drw-skincare-components'

const siteConfig = {
  name: "My Skincare Store",
  whatsappNumber: "6281234567890",
  primaryColor: "#ec4899"
}

const apiConfig = {
  baseUrl: "https://api.mystore.com",
  endpoints: { products: "/products" }
}

export default function GenericDemo() {
  return (
    <DrwSkincareProvider siteConfig={siteConfig} apiConfig={apiConfig}>
      <GenericProductList
        filters={{ categories: true, search: true }}
        onProductClick={(product) => router.push(`/products/${product.slug}`)}
      />
    </DrwSkincareProvider>
  )
}
```

## 🔧 Configuration

### Site Configuration

```tsx
interface SiteConfig {
  name: string                    // Brand/store name
  whatsappNumber: string         // WhatsApp number with country code
  primaryColor?: string          // Primary theme color
  backgroundColor?: string       // Background color
  features?: {
    whatsappIntegration?: boolean
    productCategories?: boolean
    productSearch?: boolean
    priceDisplay?: boolean
  }
}
```

### API Configuration

```tsx
interface APIConfig {
  baseUrl: string               // API base URL
  version?: string             // API version
  timeout?: number            // Request timeout
  headers?: Record<string, string>
  endpoints?: {
    products?: string         // Products endpoint
    categories?: string       // Categories endpoint
    product?: string         // Single product endpoint
  }
}
```

## 🎨 Components

### GenericProductCard
- Configurable product card component
- Custom styling and event handlers
- WhatsApp integration
- BPOM and category display

### GenericProductDetail
- Product detail page with tabs
- Image gallery with thumbnails
- Related products section
- Custom tab configuration

### GenericProductList
- Product listing with filters
- Search, category, price range filters
- Pagination support
- Custom grid layouts

### DrwSkincareProvider
- React Context provider
- Global configuration management
- No prop drilling

## 🔍 Demo

Akses demo komponen generic di:
```
http://localhost:3000/demo
```

Demo menampilkan:
- ✅ Komponen yang dikonfigurasi via props
- ✅ API endpoints yang fleksibel
- ✅ Theme customization
- ✅ WhatsApp integration
- ✅ Multi-language support

## 📦 NPM Package

Komponen generic siap untuk ekstraksi sebagai NPM package:

```bash
# Build package
npm run build

# Publish to NPM
npm publish
```

Package akan tersedia sebagai `@drwskincare/react-components`.

### Installation NPM Package

```bash
npm install @drwskincare/react-components
```

### Usage NPM Package

```tsx
import { 
  DrwSkincareProvider, 
  GenericProductList 
} from '@drwskincare/react-components'

// See src/lib/README.md for complete documentation
```

## 🐛 Troubleshooting

### Common Issues

1. **Webpack Module Error**: Clear cache dan reinstall dependencies
```bash
rm -rf .next node_modules package-lock.json
npm install
```

2. **Database Connection**: Pastikan PostgreSQL running dan DATABASE_URL benar

3. **Image Loading**: Gunakan SafeImage component untuk handle null images

4. **TypeScript Errors**: Run `npx prisma generate` untuk update types

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Initial product display system
- ✅ Category filtering and package integration
- ✅ FontAwesome icons implementation
- ✅ Database optimization and error handling
- ✅ Generic components for NPM package
- ✅ Complete refactoring from hardcoded to configurable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **MKWcorp** - Initial work and refactoring
- **DR.W Skincare** - Product requirements and testing

## 🔗 Links

- [Live Demo](https://drwskincarebanyuwangi.com)
- [API Documentation](https://drwskincarebanyuwangi.com/api/docs)
- [NPM Package](https://www.npmjs.com/package/@drwskincare/react-components)
- [Issues](https://github.com/MKWcorp/productdrwskincare/issues)

---

⭐ **Star this repo if you find it helpful!** ⭐ 
  Product, 
  ProductPackage, 
  Category, 
  ApiResponse,
  ProductListProps,
  ProductDetailProps,
  ProductCardProps
} from '@drw/product-components';
```

## Styling

The library uses TailwindCSS for styling. You can customize the appearance by:

1. **Override CSS classes** - All components accept `className` props
2. **Custom CSS** - Import and override the default styles
3. **Tailwind configuration** - Extend your Tailwind config

```tsx
<ProductList 
  className="custom-product-list"
  cardClassName="custom-product-card"
/>
```

## Development

To develop and contribute to this library:

```bash
# Clone the repository
git clone <repository-url>
cd productdrwskincare

# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Build demo
npm run build
```

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please contact the DRW Skincare development team.
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
