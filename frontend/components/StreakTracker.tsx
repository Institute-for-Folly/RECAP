'use client';

import { useAccount, useReadContract } from 'wagmi';
import { DAILY_RECAP_ABI, CONTRACT_ADDRESSES } from '@/contracts/DailyRecap';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';

export default function StreakTracker() {
  const { address, chain } = useAccount();
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const contractAddress = chain?.id === base.id 
    ? CONTRACT_ADDRESSES.base 
    : CONTRACT_ADDRESSES.baseSepolia;

  const { data: totalRecaps } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DAILY_RECAP_ABI,
    functionName: 'getTotalRecaps',
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    }
  });

  useEffect(() => {
    const calculateStreak = async () => {
      if (!address || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        setIsLoading(false);
        return;
      }

      try {
        // Calculate streak by checking consecutive days
        let currentStreak = 0;
        const today = Math.floor(Date.now() / 1000 / 86400);
        
        // Check last 100 days for streak (simplified)
        for (let i = 0; i < 100; i++) {
          const dayToCheck = today - i;
          
          // Note: This would need actual contract calls to check hasRecapForDay
          // For now, just show 0 until user submits
          break;
        }
        
        setStreak(currentStreak);
      } catch (error) {
        console.error('Error calculating streak:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateStreak();
  }, [address, contractAddress]);

  if (!address) {
    return null;
  }

  if (contractAddress === '0x0000000000000000000000000000000000000000') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-orange-800 mb-1">Your Streak</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-orange-600">
              {isLoading ? '...' : streak}
            </span>
            <span className="text-lg text-orange-500">
              {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
        <div className="text-5xl">
          {streak === 0 ? '🌱' : streak < 7 ? '🔥' : streak < 30 ? '⚡' : '🏆'}
        </div>
      </div>
      <div className="mt-4 text-xs text-orange-700">
        {streak === 0 && "Submit your first recap to start your streak!"}
        {streak > 0 && streak < 7 && "Keep going! You're building momentum 🚀"}
        {streak >= 7 && streak < 30 && "Amazing! A full week streak 🎉"}
        {streak >= 30 && "Legendary! 30+ day streak 👑"}
      </div>
    </div>
  );
}
