import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced connection string with pool settings
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL
  if (!baseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // Add connection pool parameters to URL if not already present
  const url = new URL(baseUrl)
  if (!url.searchParams.has('pool_timeout')) {
    url.searchParams.set('pool_timeout', '60')
  }
  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', '8')
  }
  if (!url.searchParams.has('connect_timeout')) {
    url.searchParams.set('connect_timeout', '30')
  }
  
  return url.toString()
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  }
})

// Clean up connections on process exit
if (typeof window === 'undefined') {
  const cleanup = async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
  }
  
  process.on('beforeExit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma