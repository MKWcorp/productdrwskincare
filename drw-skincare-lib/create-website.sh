#!/bin/bash

# DR.W Skincare Website Generator
# Script untuk membuat website baru dengan mudah

echo "🚀 DR.W Skincare Website Generator"
echo "================================="

# Input website details
read -p "Nama website (contoh: DR.W Skincare Jakarta): " SITE_NAME
read -p "Subtitle (contoh: Solusi Perawatan Kulit Terpercaya): " SITE_SUBTITLE  
read -p "Nomor WhatsApp (contoh: 6281234567890): " WHATSAPP
read -p "Warna utama (contoh: #2563eb): " PRIMARY_COLOR
read -p "Warna sekunder (contoh: #1e40af): " SECONDARY_COLOR
read -p "Nama folder project: " PROJECT_NAME

echo ""
echo "🔧 Membuat project $PROJECT_NAME..."

# Create Next.js project
npx create-next-app@latest $PROJECT_NAME --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd $PROJECT_NAME

# Install DR.W Skincare components
echo "📦 Installing DR.W Skincare components..."
# npm install @drw-skincare/components @prisma/client prisma pg @types/pg

# Create environment file
echo "⚙️  Setting up environment..."
cat > .env.local << EOF
# Website Configuration
NEXT_PUBLIC_SITE_NAME="$SITE_NAME"
NEXT_PUBLIC_SITE_SUBTITLE="$SITE_SUBTITLE"
NEXT_PUBLIC_WHATSAPP="$WHATSAPP"
NEXT_PUBLIC_PRIMARY_COLOR="$PRIMARY_COLOR"
NEXT_PUBLIC_SECONDARY_COLOR="$SECONDARY_COLOR"

# DR.W Skincare Database
DATABASE_URL="postgresql://berkomunitas:berkomunitas688@213.190.4.159:5432/drwskincare"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
EOF

# Create Prisma schema
mkdir -p prisma
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model produk {
  id_produk          BigInt               @id
  nama_produk        String               @db.VarChar(255)
  bpom               String?              @db.VarChar(20)
  harga_director     Int                  @default(0)
  harga_manager      Int                  @default(0)
  harga_supervisor   Int                  @default(0)
  harga_consultant   Int                  @default(0)
  harga_umum         Int                  @default(0)
  foto_utama         String?
  deskripsi_singkat  String?
  created_at         DateTime             @default(now()) @db.Timestamptz(6)
  updated_at         DateTime             @default(now()) @db.Timestamptz(6)
  slug               String?              @unique @db.VarChar(255)
  produk_kategori    produk_kategori[]
  produk_detail      produk_detail?
  produk_bahan_aktif produk_bahan_aktif[]
  foto_produk        foto_produk[]
}

model kategori {
  id              Int               @id @default(autoincrement())
  nama_kategori   String            @unique @db.VarChar(100)
  deskripsi       String?
  created_at      DateTime          @default(now()) @db.Timestamptz(6)
  produk_kategori produk_kategori[]
}

model produk_kategori {
  produk_id   BigInt
  kategori_id Int
  kategori    kategori @relation(fields: [kategori_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  produk      produk   @relation(fields: [produk_id], references: [id_produk], onDelete: Cascade, onUpdate: NoAction)

  @@id([produk_id, kategori_id])
}

model produk_detail {
  produk_id  BigInt  @id
  kegunaan   String?
  komposisi  String?
  cara_pakai String?
  netto      String? @db.VarChar(50)
  no_bpom    String? @db.VarChar(30)
  produk     produk  @relation(fields: [produk_id], references: [id_produk], onDelete: Cascade, onUpdate: NoAction, map: "fk_produk")
}

model bahan_aktif {
  id                 Int                  @id @default(autoincrement())
  nama_bahan         String               @unique @db.VarChar(100)
  produk_bahan_aktif produk_bahan_aktif[]
}

model produk_bahan_aktif {
  produk_id   BigInt
  bahan_id    Int
  fungsi      String?     @db.VarChar(100)
  bahan_aktif bahan_aktif @relation(fields: [bahan_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  produk      produk      @relation(fields: [produk_id], references: [id_produk], onDelete: Cascade, onUpdate: NoAction)

  @@id([produk_id, bahan_id])
}

model foto_produk {
  id_foto    BigInt   @id @default(autoincrement())
  produk_id  BigInt?
  url_foto   String
  alt_text   String?  @db.VarChar(255)
  urutan     Int      @default(0)
  created_at DateTime @default(now()) @db.Timestamptz(6)
  produk     produk?  @relation(fields: [produk_id], references: [id_produk], onDelete: Cascade, onUpdate: NoAction, map: "fk_produk")
}
EOF

echo "🎨 Creating main page..."
cat > src/app/page.tsx << 'EOF'
"use client"

import { useState, useEffect } from 'react'

// Temporary inline components until library is published
interface Product {
  id_produk: string
  nama_produk: string
  harga_umum: number
  foto_utama?: string
  deskripsi_singkat?: string
  kategori?: string
}

const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "DR.W Skincare",
  subtitle: process.env.NEXT_PUBLIC_SITE_SUBTITLE || "Solusi Perawatan Kulit Terpercaya",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "6281234567890",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#2563eb",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#1e40af"
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat produk DR.W Skincare...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: siteConfig.primaryColor }}
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
              Produk Perawatan Kulit Terbaik
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Temukan solusi perawatan kulit yang tepat untuk Anda dengan produk berkualitas tinggi dari DR.W Skincare
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Produk Kami ({products.length})</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id_produk} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.foto_utama ? (
                      <img 
                        src={product.foto_utama} 
                        alt={product.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-gray-400">
                        {product.nama_produk.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{product.nama_produk}</h3>
                    {product.deskripsi_singkat && (
                      <p className="text-sm text-gray-600 mb-3">{product.deskripsi_singkat}</p>
                    )}
                    <p 
                      className="text-lg font-bold mb-4"
                      style={{ color: siteConfig.primaryColor }}
                    >
                      Rp {product.harga_umum.toLocaleString('id-ID')}
                    </p>
                    <button
                      onClick={() => {
                        const message = `Halo, saya tertarik dengan produk ${product.nama_produk} - Rp ${product.harga_umum.toLocaleString('id-ID')}. Mohon info lebih lanjut.`
                        window.open(`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                      className="w-full py-2 px-4 text-white rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: siteConfig.primaryColor }}
                    >
                      Pesan via WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: siteConfig.primaryColor }}
            >
              {siteConfig.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Hubungi kami di WhatsApp: {siteConfig.whatsapp}
            </p>
            <p className="text-sm text-gray-500">
              © 2024 DR.W Skincare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF

echo "🔌 Creating API routes..."
mkdir -p src/app/api/products
cat > src/app/api/products/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.produk.findMany({
      include: {
        produk_kategori: {
          include: {
            kategori: true
          }
        },
        produk_detail: true,
        foto_produk: {
          orderBy: { urutan: 'asc' },
          take: 1
        }
      },
      take: 50,
      orderBy: { created_at: 'desc' }
    })

    const transformedProducts = products.map(product => ({
      id_produk: product.id_produk.toString(),
      nama_produk: product.nama_produk,
      harga_umum: product.harga_umum,
      foto_utama: product.foto_utama || (product.foto_produk[0]?.url_foto),
      deskripsi_singkat: product.deskripsi_singkat,
      kategori: product.produk_kategori[0]?.kategori?.nama_kategori,
      bpom: product.bpom,
      slug: product.slug
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      total: transformedProducts.length
    })

  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
EOF

echo "📚 Creating README..."
cat > README.md << EOF
# $SITE_NAME

Website produk DR.W Skincare yang terhubung langsung dengan database.

## Features

✅ Terhubung langsung ke database DR.W Skincare  
✅ Responsive design dengan Tailwind CSS  
✅ Integrasi WhatsApp untuk pemesanan  
✅ TypeScript support  
✅ Fast loading dengan Next.js 14  

## Configuration

Website ini dikonfigurasi dengan:

- **Nama**: $SITE_NAME
- **Subtitle**: $SITE_SUBTITLE
- **WhatsApp**: $WHATSAPP
- **Warna Utama**: $PRIMARY_COLOR
- **Warna Sekunder**: $SECONDARY_COLOR

## Development

\`\`\`bash
npm run dev
\`\`\`

## Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Database

Website ini menggunakan database PostgreSQL DR.W Skincare dengan koneksi otomatis.
Total produk akan dimuat secara real-time dari database.
EOF

echo ""
echo "✅ Website $SITE_NAME berhasil dibuat!"
echo ""
echo "Langkah selanjutnya:"
echo "1. cd $PROJECT_NAME"
echo "2. npm install @prisma/client prisma pg @types/pg"
echo "3. npx prisma generate"
echo "4. npm run dev"
echo ""
echo "🚀 Website akan berjalan di http://localhost:3000"
echo "📱 WhatsApp: $WHATSAPP"
echo "🎨 Warna: $PRIMARY_COLOR"