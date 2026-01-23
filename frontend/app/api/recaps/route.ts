import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createPublicClient, decodeEventLog, http, isAddress, keccak256, toBytes } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES, DAILY_RECAP_ABI } from '@/contracts/DailyRecap';

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
    const { recapHash, recapJson, txHash, chainId } = body;
    
    if (!recapHash || !recapJson || !txHash || !chainId) {
      return NextResponse.json({ error: 'Missing recapHash, recapJson, txHash, or chainId' }, { status: 400 });
    }

    const computedHash = keccak256(toBytes(recapJson));
    if (computedHash.toLowerCase() !== recapHash.toLowerCase()) {
      return NextResponse.json({ error: 'recapHash does not match recapJson' }, { status: 400 });
    }

    let parsedRecapData: {
      address: string;
      bullets: string[];
      meaning: string;
      stats: {
        txCount: number;
        uniqueContracts: number;
        netEthChange: string;
      };
      createdAt: number;
    };

    try {
      parsedRecapData = JSON.parse(recapJson);
    } catch (error) {
      console.error('Error parsing recapJson:', error);
      return NextResponse.json({ error: 'Invalid recapJson' }, { status: 400 });
    }
    
    // Validate recapData structure
    if (
      !parsedRecapData.address ||
      !parsedRecapData.bullets ||
      !parsedRecapData.meaning ||
      !parsedRecapData.stats
    ) {
      return NextResponse.json({ error: 'Invalid recapData structure' }, { status: 400 });
    }

    // Validate address format
    if (!isAddress(parsedRecapData.address)) {
      return NextResponse.json({ error: 'Invalid Ethereum address format' }, { status: 400 });
    }

    // Validate bullets is an array
    if (!Array.isArray(parsedRecapData.bullets)) {
      return NextResponse.json({ error: 'bullets must be an array' }, { status: 400 });
    }

    // Validate stats is an object with required numeric and string properties
    if (
      typeof parsedRecapData.stats !== 'object' ||
      parsedRecapData.stats === null ||
      typeof parsedRecapData.stats.txCount !== 'number' ||
      typeof parsedRecapData.stats.uniqueContracts !== 'number' ||
      typeof parsedRecapData.stats.netEthChange !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid stats structure' }, { status: 400 });
    }

    const chain = chainId === base.id ? base : chainId === baseSepolia.id ? baseSepolia : null;
    const contractAddress = chainId === base.id ? CONTRACT_ADDRESSES.base : CONTRACT_ADDRESSES.baseSepolia;

    if (!chain || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json({ error: 'Unsupported chain or contract not deployed' }, { status: 400 });
    }

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
    if (receipt.status !== 'success') {
      return NextResponse.json({ error: 'Transaction failed or not confirmed' }, { status: 400 });
    }

    const normalizedAddress = parsedRecapData.address.toLowerCase();
    let matchedEvent: { dayId: bigint } | null = null;

    // Filter logs by contract address and attempt to decode only matching logs
    const relevantLogs = receipt.logs.filter(
      log => log.address.toLowerCase() === contractAddress.toLowerCase()
    );

    for (const log of relevantLogs) {
      try {
        const decoded = decodeEventLog({
          abi: DAILY_RECAP_ABI,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== 'RecapSubmitted') {
          continue;
        }

        const args = decoded.args as {
          user: string;
          dayId: bigint;
          recapHash: string;
          timestamp: bigint;
        };

        if (args.recapHash.toLowerCase() === recapHash.toLowerCase() && args.user.toLowerCase() === normalizedAddress) {
          matchedEvent = { dayId: args.dayId };
          break;
        }
      } catch (error) {
        console.error('Error decoding event log:', error);
      }
    }

    if (!matchedEvent) {
      return NextResponse.json({ error: 'RecapSubmitted event not found for transaction' }, { status: 400 });
    }

    // Validate dayId conversion to prevent precision loss
    if (matchedEvent.dayId > Number.MAX_SAFE_INTEGER) {
      return NextResponse.json({ error: 'dayId exceeds safe integer range' }, { status: 400 });
    }

    const storedRecap = {
      ...parsedRecapData,
      dayId: Number(matchedEvent.dayId),
    };
    
    // Store in KV with hash as key
    await kv.set(`recap:${recapHash}`, storedRecap);
    
    // Also index by address+dayId for easier lookup (use normalized address)
    const indexKey = `user:${normalizedAddress}:${storedRecap.dayId}`;
    await kv.set(indexKey, recapHash);
    
    return NextResponse.json({ success: true, dayId: storedRecap.dayId });
  } catch (error) {
    console.error('Error storing recap:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
