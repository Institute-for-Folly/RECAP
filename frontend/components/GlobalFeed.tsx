'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES, DAILY_RECAP_ABI } from '@/contracts/DailyRecap';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';
import { parseAbiItem } from 'viem';
import { formatDayId } from '@/lib/baseActivity';

interface RecapEvent {
  user: string;
  dayId: number;
  recapHash: string;
  timestamp: number;
}

export default function GlobalFeed() {
  const { chain } = useAccount();
  const publicClient = usePublicClient();
  const [recaps, setRecaps] = useState<RecapEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const contractAddress = chain?.id === base.id 
    ? CONTRACT_ADDRESSES.base 
    : CONTRACT_ADDRESSES.baseSepolia;

  useEffect(() => {
    fetchRecaps();
  }, [chain, contractAddress]);

  const fetchRecaps = async () => {
    if (!publicClient || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      setIsLoading(false);
      return;
    }

    try {
      const latestBlock = await publicClient.getBlockNumber();
      const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n;

      const logs = await publicClient.getLogs({
        address: contractAddress as `0x${string}`,
        event: parseAbiItem('event RecapSubmitted(address indexed user, uint256 indexed dayId, bytes32 recapHash, uint256 timestamp)'),
        fromBlock,
        toBlock: latestBlock,
      });

      const events = logs.map(log => ({
        user: log.args.user as string,
        dayId: Number(log.args.dayId),
        recapHash: log.args.recapHash as string,
        timestamp: Number(log.args.timestamp),
      })).reverse().slice(0, 50);

      setRecaps(events);
    } catch (error) {
      console.error('Error fetching recaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="text-center text-gray-500 py-8">
        Contract not deployed yet. Deploy the contract to see the global feed.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 animate-pulse">📊</div>
        <p className="text-gray-600">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Global Feed</h2>
        <div className="text-sm text-gray-500">
          {recaps.length} recent proof cards
        </div>
      </div>

      {recaps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No proof cards yet. Be the first to submit!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recaps.map((recap, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {recap.user.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-gray-900">
                      {formatAddress(recap.user)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(recap.timestamp)} • Day {recap.dayId}
                    </div>
                  </div>
                </div>
                <a
                  href={`${chain?.id === base.id ? 'https://basescan.org' : 'https://sepolia.basescan.org'}/address/${recap.user}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  View on Basescan →
                </a>
              </div>
              <div className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded break-all">
                Hash: {recap.recapHash}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
