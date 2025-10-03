import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client'
import { prisma } from './db'

export interface DatabaseError {
  message: string
  code?: string
  isRetryable: boolean
}

export class DatabaseConnectionError extends Error {
  public isRetryable: boolean
  public code?: string

  constructor(message: string, code?: string, isRetryable = false) {
    super(message)
    this.name = 'DatabaseConnectionError'
    this.isRetryable = isRetryable
    this.code = code
  }
}

export function isDatabaseError(error: unknown): error is PrismaClientKnownRequestError | PrismaClientUnknownRequestError {
  return error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError
}

export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2024': // Connection pool timeout
        return {
          message: 'Database connection timeout. Please try again.',
          code: error.code,
          isRetryable: true
        }
      case 'P1017': // Connection error
      case 'P1001': // Can't reach database server
        return {
          message: 'Database connection failed. Please check your connection.',
          code: error.code,
          isRetryable: true
        }
      case 'P2025': // Record not found
        return {
          message: 'Requested data not found.',
          code: error.code,
          isRetryable: false
        }
      default:
        return {
          message: `Database error: ${error.message}`,
          code: error.code,
          isRetryable: false
        }
    }
  }

  if (error instanceof PrismaClientUnknownRequestError) {
    return {
      message: 'An unknown database error occurred. Please try again.',
      code: 'UNKNOWN',
      isRetryable: true
    }
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    isRetryable: false
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      const dbError = handleDatabaseError(error)
      
      if (!dbError.isRetryable || attempt === maxRetries) {
        throw new DatabaseConnectionError(dbError.message, dbError.code, dbError.isRetryable)
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await withRetry(async () => {
      await prisma.$queryRaw`SELECT 1`
    })
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Connection pool info
export async function getConnectionPoolInfo() {
  try {
    const result = await prisma.$queryRaw<Array<{ active_connections: number; max_connections: number }>>`
      SELECT 
        count(*) as active_connections,
        setting::int as max_connections
      FROM pg_stat_activity 
      CROSS JOIN pg_settings 
      WHERE pg_settings.name = 'max_connections'
      AND pg_stat_activity.state = 'active'
      GROUP BY setting
    `
    
    return result[0] || { active_connections: 0, max_connections: 100 }
  } catch (error) {
    console.error('Failed to get connection pool info:', error)
    return { active_connections: 0, max_connections: 100 }
  }
}