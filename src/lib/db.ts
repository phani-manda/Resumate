import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton Pattern
 * 
 * This file implements a global singleton for PrismaClient to prevent connection exhaustion
 * during development. In development mode with hot-reloading, each module reload would create
 * a new PrismaClient instance, quickly exhausting database connections.
 * 
 * The singleton pattern ensures only one PrismaClient instance exists across all imports.
 * 
 * Usage:
 * - Import this module wherever database access is needed: `import prisma from '@/lib/db'`
 * - Both the default export and named `prisma` export refer to the same instance
 * - DO NOT create new `PrismaClient()` instances elsewhere in the codebase
 * 
 * The instance is stored on globalThis in development to persist across hot-reloads,
 * while in production a new instance is created on each cold start (which is expected).
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export { prisma }
