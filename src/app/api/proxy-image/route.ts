import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  if (!url) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    const blob = await res.blob();
    const response = new NextResponse(blob);
    
    // Forward the content type or fallback to JPEG
    response.headers.set('Content-Type', res.headers.get('Content-Type') || 'image/jpeg');
    
    // Critical for client-side capture: Allow CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return response;
  } catch (error: any) {
    console.error(`[IMAGE_PROXY] Error proxying ${url}:`, error.message);
    return new Response(`Failed to proxy image: ${error.message}`, { status: 500 });
  }
}
