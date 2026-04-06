import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const presentations = await prisma.presentation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        data: true, // we might need this for languages and downloads
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
    console.error('Error fetching presentations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch history' }, { status: 500 });
  }
}
