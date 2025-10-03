import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

async function testDatabase() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test 1: Count products
    const count = await prisma.produk.count()
    console.log(`✅ Total products: ${count}`)
    
    // Test 2: Get first 3 products with basic info
    const products = await prisma.produk.findMany({
      take: 3,
      select: {
        id_produk: true,
        nama_produk: true,
        harga_umum: true,
        deskripsi_singkat: true,
        bpom: true
      }
    })
    
    console.log('📦 Sample products:')
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.nama_produk} - Rp ${product.harga_umum}`)
      console.log(`      ID: ${product.id_produk}, BPOM: ${product.bpom || 'N/A'}`)
    })
    
    // Test 3: Test with relationships
    console.log('\n🔗 Testing relationships...')
    const productWithRelations = await prisma.produk.findFirst({
      include: {
        produk_kategori: {
          include: {
            kategori: true
          }
        },
        foto_produk: true
      }
    })
    
    if (productWithRelations) {
      console.log(`✅ Product with relations: ${productWithRelations.nama_produk}`)
      console.log(`   Categories: ${productWithRelations.produk_kategori?.length || 0}`)
      console.log(`   Photos: ${productWithRelations.foto_produk?.length || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

testDatabase()