import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prismaClientSingleton = () => {
  try {
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

const prisma = getPrisma();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
