import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// GET /api/recaps?hash=0x...
// Retrieve recap JSON by hash
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hash = searchParams.get('hash');
    
    if (!hash) {
      return NextResponse.json({ error: 'Missing hash parameter' }, { status: 400 });
    }
    
    // Fetch from KV store
    const recap = await kv.get(`recap:${hash}`);
    
    if (!recap) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }
    
    return NextResponse.json(recap);
  } catch (error) {
    console.error('Error fetching recap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/recaps
// Store recap JSON
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recapHash, recapData } = body;
    
    if (!recapHash || !recapData) {
      return NextResponse.json({ error: 'Missing recapHash or recapData' }, { status: 400 });
    }
    
    // Validate recapData structure
    if (!recapData.dayId || !recapData.address || !recapData.bullets || !recapData.stats) {
      return NextResponse.json({ error: 'Invalid recapData structure' }, { status: 400 });
    }
    
    // Store in KV with hash as key
    await kv.set(`recap:${recapHash}`, recapData);
    
    // Also index by address+dayId for easier lookup
    const indexKey = `user:${recapData.address}:${recapData.dayId}`;
    await kv.set(indexKey, recapHash);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing recap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
