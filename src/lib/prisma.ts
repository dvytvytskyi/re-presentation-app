import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prismaClientSingleton = () => {
  try {
    // Only initialize Prisma if DATABASE_URL is available (prevents build crashes)
    if (!process.env.DATABASE_URL) {
      console.warn('Prisma build warning: DATABASE_URL not found, returning placeholder.');
      return null as any;
    }
    return new PrismaClient();
  } catch (err) {
    console.error('PrismaClient failed to initialize:', err);
    return null as any; 
  }
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Lazy initialization wrapped in safe check
const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  globalForPrisma.prisma = prismaClientSingleton();
  return globalForPrisma.prisma;
};

// Truly lazy initialization
const prisma: PrismaClientSingleton = new Proxy({} as PrismaClientSingleton, {
  get: (target, prop) => {
    const p = getPrisma();
    if (!p) {
        // Fallback for build time if DATABASE_URL is missing
        return undefined;
    }
    return (p as any)[prop];
  }
});

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
