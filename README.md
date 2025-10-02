# DRW Product Components

A reusable React component library for DRW Skincare product pages. This library provides ready-to-use components for product listings, detail pages, search/filter functionality, and WhatsApp integration that can be used across multiple websites.

## Features

- 📦 **Product Display Components** - Cards, lists, and detail views
- 🔍 **Search & Filter** - Built-in filtering by category, price range, and search terms
- 📱 **Responsive Design** - Mobile-first design with TailwindCSS
- 💬 **WhatsApp Integration** - Direct product inquiry via WhatsApp
- 🎨 **Customizable Styling** - Easy to theme and customize
- 📡 **API Integration** - Built-in API client for DRW Skincare backend
- 🔄 **Loading States** - Elegant loading and error handling
- 💎 **TypeScript** - Full TypeScript support with comprehensive types

## Installation

```bash
npm install @drw/product-components
# or
yarn add @drw/product-components
# or
pnpm add @drw/product-components
```

## Quick Start

### 1. Import Styles

Make sure to import the component styles in your main CSS file or application entry point:

```css
@import '@drw/product-components/dist/style.css';
```

### 2. Basic Usage

```tsx
import { ProductList, ProductDetail, DrwApiClient } from '@drw/product-components';

// Initialize API client
const apiClient = new DrwApiClient({
  baseUrl: 'https://your-api-endpoint.com',
  whatsappNumber: '+1234567890'
});

// Product List Component
function ProductsPage() {
  return (
    <ProductList 
      apiClient={apiClient}
      showSearch={true}
      showFilters={true}
      itemsPerPage={12}
    />
  );
}

// Product Detail Component
function ProductDetailPage({ productId }: { productId: string }) {
  return (
    <ProductDetail 
      apiClient={apiClient}
      productId={productId}
      showWhatsAppButton={true}
    />
  );
}
```

## Components

### ProductList

Displays a list of products with search and filter functionality.

```tsx
<ProductList 
  apiClient={apiClient}
  showSearch={true}
  showFilters={true}
  itemsPerPage={12}
  onProductClick={(product) => console.log('Product clicked:', product)}
/>
```

**Props:**
- `apiClient`: DrwApiClient instance
- `showSearch?`: boolean - Show search input (default: true)
- `showFilters?`: boolean - Show category and price filters (default: true)
- `itemsPerPage?`: number - Products per page (default: 12)
- `onProductClick?`: (product: Product) => void - Product click handler

### ProductDetail

Shows detailed product information with package options and WhatsApp integration.

```tsx
<ProductDetail 
  apiClient={apiClient}
  productId="product-123"
  showWhatsAppButton={true}
  onWhatsAppClick={(product, selectedPackage) => console.log('WhatsApp click')}
/>
```

**Props:**
- `apiClient`: DrwApiClient instance
- `productId`: string - Product ID to display
- `showWhatsAppButton?`: boolean - Show WhatsApp inquiry button (default: true)
- `onWhatsAppClick?`: (product: Product, package: ProductPackage) => void - WhatsApp click handler

### ProductCard

Individual product card component for custom layouts.

```tsx
<ProductCard 
  product={product}
  onProductClick={(product) => navigate(`/products/${product.id}`)}
  onWhatsAppClick={(product, pkg) => openWhatsApp(product, pkg)}
/>
```

**Props:**
- `product`: Product - Product data
- `onProductClick?`: (product: Product) => void - Card click handler
- `onWhatsAppClick?`: (product: Product, package: ProductPackage) => void - WhatsApp button handler

## API Client

### DrwApiClient

```tsx
const apiClient = new DrwApiClient({
  baseUrl: 'https://api.drwskincare.com',
  whatsappNumber: '+1234567890',
  timeout: 10000
});

// Get all products
const products = await apiClient.getProducts();

// Get single product
const product = await apiClient.getProduct('product-123');

// Get featured products
const featured = await apiClient.getFeaturedProducts();
```

**Configuration:**
- `baseUrl`: string - API base URL
- `whatsappNumber`: string - WhatsApp number for inquiries
- `timeout?`: number - Request timeout in milliseconds (default: 10000)

## Hooks

### useProductList

```tsx
const { 
  products, 
  loading, 
  error, 
  searchTerm, 
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  filteredProducts
} = useProductList(apiClient);
```

### useProductDetail

```tsx
const { 
  product, 
  loading, 
  error, 
  selectedPackage, 
  setSelectedPackage 
} = useProductDetail(apiClient, productId);
```

### useFeaturedProducts

```tsx
const { 
  featuredProducts, 
  loading, 
  error 
} = useFeaturedProducts(apiClient);
```

### useWhatsApp

```tsx
const { openWhatsApp } = useWhatsApp(whatsappNumber);

// Usage
openWhatsApp(product, selectedPackage);
```

## Types

The library exports comprehensive TypeScript types:

```tsx
import type { 
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
