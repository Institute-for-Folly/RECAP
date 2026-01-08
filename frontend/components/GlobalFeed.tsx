'use client';

import { useReadContract } from 'wagmi';
import { DAILY_RECAP_ABI, CONTRACT_ADDRESSES } from '@/contracts/DailyRecap';
import { base, baseSepolia } from 'wagmi/chains';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

interface Recap {
  user: string;
  timestamp: bigint;
  contentHash: string;
}

export default function GlobalFeed() {
  const { chain } = useAccount();
  const [recaps, setRecaps] = useState<Recap[]>([]);
  
  const contractAddress = chain?.id === base.id 
    ? CONTRACT_ADDRESSES.base 
    : CONTRACT_ADDRESSES.baseSepolia;

  const { data: totalRecaps } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DAILY_RECAP_ABI,
    functionName: 'getTotalRecaps',
    query: {
      enabled: !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    }
  });

  const { data: latestRecaps } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DAILY_RECAP_ABI,
    functionName: 'getLatestRecaps',
    args: [0n, 10n],
    query: {
      enabled: !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    }
  });

  useEffect(() => {
    if (latestRecaps) {
      setRecaps(latestRecaps as Recap[]);
    }
  }, [latestRecaps]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Global Feed</h2>
        <div className="text-sm text-gray-500">
          {totalRecaps ? `${totalRecaps.toString()} total recaps` : '0 recaps'}
        </div>
      </div>

      {recaps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No recaps yet. Be the first to submit!</p>
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
                      {formatDate(recap.timestamp)}
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
                Hash: {recap.contentHash}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
