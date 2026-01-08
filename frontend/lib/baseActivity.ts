import { createPublicClient, http, parseAbiItem } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  methodId?: string;
  functionName?: string;
}

export interface Activity {
  transactions: Transaction[];
  txCount: number;
  uniqueContracts: number;
  netEthChange: string;
  topContracts: { address: string; count: number }[];
  actions: {
    swaps: number;
    mints: number;
    transfers: number;
    interactions: number;
  };
}

export interface RecapBullets {
  bullets: string[];
  stats: {
    txCount: number;
    uniqueContracts: number;
    netEthChange: string;
  };
  topContracts: string[];
}

// Known DEX and NFT contract signatures
const DEX_SIGNATURES = ['0x38ed1739', '0x7ff36ab5', '0x18cbafe5']; // swapExactTokensForTokens, etc
const MINT_SIGNATURES = ['0x1249c58b', '0xa0712d68', '0x6a627842']; // mint functions
const TRANSFER_SIGNATURES = ['0xa9059cbb', '0x23b872dd']; // transfer, transferFrom

function categorizeTransaction(tx: Transaction): string {
  const methodId = tx.methodId?.toLowerCase() || '';
  
  if (DEX_SIGNATURES.includes(methodId)) return 'swap';
  if (MINT_SIGNATURES.includes(methodId)) return 'mint';
  if (TRANSFER_SIGNATURES.includes(methodId)) return 'transfer';
  if (tx.value !== '0') return 'transfer';
  
  return 'contract_interaction';
}

export async function fetchBaseActivity(
  address: string,
  chainId: number
): Promise<Activity> {
  try {
    const chain = chainId === base.id ? base : baseSepolia;
    
    // Try Basescan API first if available
    if (process.env.NEXT_PUBLIC_BASESCAN_API_KEY) {
      return await fetchFromBasescan(address, chainId);
    }
    
    // Fallback to RPC
    return await fetchFromRPC(address, chain);
  } catch (error) {
    console.error('Error fetching activity:', error);
    // Return empty activity
    return {
      transactions: [],
      txCount: 0,
      uniqueContracts: 0,
      netEthChange: '0',
      topContracts: [],
      actions: {
        swaps: 0,
        mints: 0,
        transfers: 0,
        interactions: 0,
      },
    };
  }
}

async function fetchFromBasescan(address: string, chainId: number): Promise<Activity> {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
  const baseUrl = chainId === base.id 
    ? 'https://api.basescan.org/api'
    : 'https://api-sepolia.basescan.org/api';
  
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  
  const url = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== '1') {
    throw new Error('Basescan API error');
  }
  
  // Filter to last 24 hours
  const recentTxs = data.result.filter((tx: any) => parseInt(tx.timeStamp) >= yesterday);
  
  return processTransactions(recentTxs.map((tx: any) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    timestamp: parseInt(tx.timeStamp),
    methodId: tx.input?.slice(0, 10),
  })), address);
}

async function fetchFromRPC(address: string, chain: typeof base | typeof baseSepolia): Promise<Activity> {
  const client = createPublicClient({
    chain,
    transport: http(),
  });
  
  const latestBlock = await client.getBlockNumber();
  const blocksPerDay = 43200n; // ~2 sec per block = 43200 blocks per day
  const fromBlock = latestBlock - blocksPerDay;
  
  // Get sent transactions
  const sentLogs = await client.getLogs({
    address: undefined,
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    args: {
      from: address as `0x${string}`,
    },
    fromBlock,
    toBlock: latestBlock,
  });
  
  // Get received transactions
  const receivedLogs = await client.getLogs({
    address: undefined,
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    args: {
      to: address as `0x${string}`,
    },
    fromBlock,
    toBlock: latestBlock,
  });
  
  // Combine and deduplicate
  const allLogs = [...sentLogs, ...receivedLogs];
  const uniqueTxs = new Map();
  
  for (const log of allLogs) {
    if (!uniqueTxs.has(log.transactionHash)) {
      uniqueTxs.set(log.transactionHash, {
        hash: log.transactionHash,
        from: address,
        to: log.address,
        value: '0',
        timestamp: Date.now() / 1000,
      });
    }
  }
  
  return processTransactions(Array.from(uniqueTxs.values()), address);
}

function processTransactions(txs: Transaction[], userAddress: string): Activity {
  const contractCounts = new Map<string, number>();
  const actions = {
    swaps: 0,
    mints: 0,
    transfers: 0,
    interactions: 0,
  };
  
  let netEth = 0n;
  
  for (const tx of txs) {
    const category = categorizeTransaction(tx);
    
    switch (category) {
      case 'swap':
        actions.swaps++;
        break;
      case 'mint':
        actions.mints++;
        break;
      case 'transfer':
        actions.transfers++;
        break;
      default:
        actions.interactions++;
    }
    
    // Track contract interactions
    if (tx.to) {
      contractCounts.set(tx.to, (contractCounts.get(tx.to) || 0) + 1);
    }
    
    // Calculate net ETH change
    if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
      netEth -= BigInt(tx.value);
    }
    if (tx.to?.toLowerCase() === userAddress.toLowerCase()) {
      netEth += BigInt(tx.value);
    }
  }
  
  // Get top contracts
  const topContracts = Array.from(contractCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([address, count]) => ({ address, count }));
  
  return {
    transactions: txs,
    txCount: txs.length,
    uniqueContracts: contractCounts.size,
    netEthChange: (netEth / 10n**18n).toString(),
    topContracts,
    actions,
  };
}

export function buildRecap(activity: Activity, address: string): RecapBullets {
  const bullets: string[] = [];
  
  // Generate bullet 1: Activity summary
  if (activity.txCount > 0) {
    if (activity.txCount === 1) {
      bullets.push(`Made 1 transaction on Base`);
    } else {
      bullets.push(`Made ${activity.txCount} transactions on Base`);
    }
  } else {
    bullets.push(`No on-chain activity today`);
  }
  
  // Generate bullet 2: Key actions
  const { swaps, mints, transfers, interactions } = activity.actions;
  const actionParts: string[] = [];
  
  if (swaps > 0) actionParts.push(`${swaps} swap${swaps > 1 ? 's' : ''}`);
  if (mints > 0) actionParts.push(`${mints} mint${mints > 1 ? 's' : ''}`);
  if (transfers > 0) actionParts.push(`${transfers} transfer${transfers > 1 ? 's' : ''}`);
  if (interactions > 0) actionParts.push(`${interactions} contract interaction${interactions > 1 ? 's' : ''}`);
  
  if (actionParts.length > 0) {
    bullets.push(`Actions: ${actionParts.join(', ')}`);
  } else {
    bullets.push(`No specific actions detected`);
  }
  
  // Generate bullet 3: Top contracts or ETH change
  if (activity.topContracts.length > 0) {
    const topContract = activity.topContracts[0];
    bullets.push(`Interacted with ${activity.uniqueContracts} unique contract${activity.uniqueContracts > 1 ? 's' : ''}`);
  } else if (activity.netEthChange !== '0') {
    bullets.push(`Net ETH change: ${activity.netEthChange} ETH`);
  } else {
    bullets.push(`Explored Base with ${address.slice(0, 6)}...${address.slice(-4)}`);
  }
  
  return {
    bullets,
    stats: {
      txCount: activity.txCount,
      uniqueContracts: activity.uniqueContracts,
      netEthChange: activity.netEthChange,
    },
    topContracts: activity.topContracts.map(c => c.address),
  };
}

export function getDayId(): number {
  // Using UTC day: floor(UTC_timestamp_ms / 86400000)
  return Math.floor(Date.now() / 86400000);
}

export function formatDayId(dayId: number): string {
  const date = new Date(dayId * 86400000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
