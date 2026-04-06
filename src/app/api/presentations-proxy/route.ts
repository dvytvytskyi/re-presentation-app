import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '500';
  const mode = searchParams.get('mode') || 'lite';

  // API credentials from .env
  const apiKey = process.env.BE_API_KEY || 'fyr_9881b745cf45c2a381a6a3ed8b7532948baa894e1dc13fe958b747248506acc0';
  const apiSecret = process.env.BE_API_SECRET || '60d7187b772dea78eb1c42fc4ee50657ec720ed517ce950f0d9eab9286cad5f6c52c72a3e8de7233fdaf5923c3c0756360a7663a463d095e2ca17d43d1ee6e54';
  
  // USE DIRECT IP TO BYPASS VERCEL DNS ISSUES
  const BE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://135.181.201.185/api'}/property-finder/projects`;
  console.log(`[DEBUG_PROXY] BE_URL: ${BE_URL}`);
  const isLite = mode === 'lite';

  try {
    // Build URL with query parameters
    const queryParams = new URLSearchParams({
      page,
      limit,
      perPage: limit,
      per_page: limit,
      search,
      mode
    });
    const fullUrl = `${BE_URL}?${queryParams.toString()}`;
      
    // console.log(`[PROXY] Forwarding to: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'x-api-secret': apiSecret,
        'Host': 'admin.foryou-realestate.com',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
       const text = await response.text();
       console.error(`Backend PROXY Error (${response.status}):`, text);
       return NextResponse.json({ 
         success: false, 
         error: 'Backend error', 
         status: response.status,
         details: text
       }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[PROXY] Internal connection error:', error.message);
    return NextResponse.json({ success: false, error: 'Proxy failed to reach backend', details: error.message }, { status: 500 });
  }
}
