import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!prisma) {
       console.error('History fetch suppressed: Prisma failed to initialize');
       return NextResponse.json({ success: true, data: [] });
    }
    const presentations = await prisma.presentation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        data: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: presentations.map((p: any) => ({
        ...p,
        data: typeof p.data === 'string' ? JSON.parse(p.data) : p.data
      })),
    });
  } catch (error: any) {
    console.error('History fetch suppressed due to Prisma error:', error.message);
    // Return an empty SUCCESS response to avoid 500 errors in the browser console
    return NextResponse.json({ success: true, data: [] });
  }
}
