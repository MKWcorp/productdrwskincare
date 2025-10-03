// Test database connection
import { checkDatabaseConnection, getConnectionPoolInfo } from './src/lib/db-utils.js'
import { prisma } from './src/lib/db.js'

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test basic connection
    const isConnected = await checkDatabaseConnection()
    console.log('Database connection:', isConnected ? '✅ Connected' : '❌ Failed')
    
    if (isConnected) {
      // Get connection pool info
      const poolInfo = await getConnectionPoolInfo()
      console.log('Connection pool info:', poolInfo)
      
      // Test basic query
      const productCount = await prisma.produk.count()
      console.log(`📊 Total products: ${productCount}`)
      
      // Test product query with timeout
      console.log('Testing product query...')
      const products = await prisma.produk.findMany({
        take: 5,
        include: {
          produk_kategori: {
            include: {
              kategori: true
            }
          }
        }
      })
      console.log(`✅ Successfully fetched ${products.length} products`)
      
    }
  } catch (error) {
    console.error('❌ Database test failed:', error)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database connection closed')
  }
}

testDatabaseConnection()