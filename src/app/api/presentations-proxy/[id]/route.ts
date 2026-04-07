import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const apiKey = process.env.BE_API_KEY || 'fyr_9881b745cf45c2a381a6a3ed8b7532948baa894e1dc13fe958b747248506acc0';
  const apiSecret = process.env.BE_API_SECRET || '60d7187b772dea78eb1c42fc4ee50657ec720ed517ce950f0d9eab9286cad5f6c52c72a3e8de7233fdaf5923c3c0756360a7663a463d095e2ca17d43d1ee6e54';
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://135.181.201.185/api'}/property-finder/projects`;

  try {
    const fullUrl = `${baseUrl}/${id}`;
    console.log(`[PROXY] Fetching Project Detail: ${fullUrl}`);
    
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
       console.error(`Backend Detail Error (${response.status}):`, text);
       return NextResponse.json({ 
         success: false, 
         error: 'Backend error', 
         status: response.status 
       }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy internal error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
