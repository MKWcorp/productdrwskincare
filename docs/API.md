# API Documentation

DR.W Skincare Product Display System API documentation.

## Base URL

```
Production: https://drwskincarebanyuwangi.com/api
Development: http://localhost:3000/api
```

## Authentication

Currently, the API is public and doesn't require authentication. All endpoints are accessible without API keys.

## Endpoints

### Products

#### GET /api/products

Get list of products with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | 1 |
| `limit` | number | Items per page (max 100) | 12 |
| `category` | string | Filter by category ID | - |
| `search` | string | Search in product names | - |
| `minPrice` | number | Minimum price filter | - |
| `maxPrice` | number | Maximum price filter | - |
| `sort` | string | Sort order (name_asc, name_desc, price_asc, price_desc, newest) | name_asc |

**Example Request:**
```http
GET /api/products?page=1&limit=12&category=skincare&search=serum&sort=price_asc
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nama_produk": "Vitamin C Serum",
      "slug": "vitamin-c-serum",
      "harga_umum": 150000,
      "foto_utama": "https://example.com/image.jpg",
      "deskripsi_singkat": "Serum vitamin C untuk kulit cerah",
      "bpom": "NA18200100123",
      "categories": [
        {
          "id": "1",
          "nama_kategori": "Serum"
        }
      ],
      "foto_produk": [
        {
          "url_foto": "https://example.com/image1.jpg",
          "alt_text": "Vitamin C Serum",
          "urutan": 1
        }
      ]
    }
  ],
  "pagination": {
    "total": 126,
    "page": 1,
    "limit": 12,
    "totalPages": 11
  }
}
```

#### GET /api/products/[slug]

Get single product by slug.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Product slug |

**Example Request:**
```http
GET /api/products/vitamin-c-serum
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "nama_produk": "Vitamin C Serum",
    "slug": "vitamin-c-serum",
    "harga_umum": 150000,
    "foto_utama": "https://example.com/image.jpg",
    "deskripsi_singkat": "Serum vitamin C untuk kulit cerah",
    "bpom": "NA18200100123",
    "kegunaan": "Mencerahkan kulit dan mengurangi tanda penuaan",
    "komposisi": "Vitamin C, Hyaluronic Acid, Niacinamide",
    "cara_pakai": "Gunakan 2-3 tetes pada wajah yang telah dibersihkan",
    "netto": "30ml",
    "bahan_aktif": [
      {
        "nama_bahan": "Vitamin C",
        "fungsi": "Antioksidan dan mencerahkan kulit"
      },
      {
        "nama_bahan": "Hyaluronic Acid",
        "fungsi": "Melembapkan dan menghaluskan kulit"
      }
    ],
    "categories": [
      {
        "id": "1",
        "nama_kategori": "Serum"
      }
    ],
    "foto_produk": [
      {
        "url_foto": "https://example.com/image1.jpg",
        "alt_text": "Vitamin C Serum Front",
        "urutan": 1
      },
      {
        "url_foto": "https://example.com/image2.jpg",
        "alt_text": "Vitamin C Serum Back",
        "urutan": 2
      }
    ]
  }
}
```

### Categories

#### GET /api/categories

Get list of all product categories.

**Example Request:**
```http
GET /api/categories
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "nama_kategori": "Serum",
      "slug": "serum",
      "product_count": 15
    },
    {
      "id": "2",
      "nama_kategori": "Moisturizer",
      "slug": "moisturizer",
      "product_count": 8
    },
    {
      "id": "3",
      "nama_kategori": "Cleanser",
      "slug": "cleanser",
      "product_count": 12
    }
  ]
}
```

#### GET /api/categories/[slug]

Get category details with products.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Category slug |

**Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 12 |

**Example Request:**
```http
GET /api/categories/serum?page=1&limit=12
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "1",
      "nama_kategori": "Serum",
      "slug": "serum",
      "product_count": 15
    },
    "products": [
      {
        "id": "1",
        "nama_produk": "Vitamin C Serum",
        "slug": "vitamin-c-serum",
        "harga_umum": 150000,
        "foto_utama": "https://example.com/image.jpg",
        "deskripsi_singkat": "Serum vitamin C untuk kulit cerah"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 12,
      "totalPages": 2
    }
  }
}
```

## Error Responses

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_CODE"
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `PRODUCT_NOT_FOUND` | Product with specified slug not found |
| `CATEGORY_NOT_FOUND` | Category with specified slug not found |
| `INVALID_PAGINATION` | Invalid page or limit parameters |
| `INVALID_SORT_PARAM` | Invalid sort parameter |
| `DATABASE_ERROR` | Database connection or query error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Production**: 100 requests per minute per IP
- **Development**: No rate limiting

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

## Data Types

### Product

```typescript
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
  categories?: Array<{
    id: string
    nama_kategori: string
  }>
  foto_produk?: Array<{
    url_foto: string
    alt_text?: string
    urutan: number
  }>
}
```

### Category

```typescript
interface Category {
  id: string
  nama_kategori: string
  slug: string
  product_count?: number
}
```

### Pagination

```typescript
interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
```

## Usage Examples

### Fetch Products with React

```tsx
import { useState, useEffect } from 'react'

function useProducts(page = 1, limit = 12) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?page=${page}&limit=${limit}`)
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError('Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, limit])

  return { products, loading, error }
}
```

### Search Products

```tsx
async function searchProducts(query: string) {
  const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
  const data = await response.json()
  return data
}
```

### Filter by Category

```tsx
async function getProductsByCategory(categorySlug: string) {
  const response = await fetch(`/api/categories/${categorySlug}`)
  const data = await response.json()
  return data
}
```

## Webhook Support

Currently, webhooks are not supported. This feature is planned for future releases.

## SDK

JavaScript/TypeScript SDK is available as part of the NPM package:

```bash
npm install @drwskincare/react-components
```

```tsx
import { useProducts, useProduct } from '@drwskincare/react-components'

// Use in components
const { products, loading } = useProducts()
const { product } = useProduct('vitamin-c-serum')
```

## Support

For API support and questions:

- **GitHub Issues**: [https://github.com/MKWcorp/productdrwskincare/issues](https://github.com/MKWcorp/productdrwskincare/issues)
- **Email**: support@drwskincare.com
- **Documentation**: [https://github.com/MKWcorp/productdrwskincare/wiki](https://github.com/MKWcorp/productdrwskincare/wiki)