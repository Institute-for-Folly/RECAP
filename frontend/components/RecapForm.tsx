'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { keccak256, toBytes } from 'viem';
import { DAILY_RECAP_ABI, CONTRACT_ADDRESSES } from '@/contracts/DailyRecap';
import { base, baseSepolia } from 'wagmi/chains';

export default function RecapForm() {
  const [recapText, setRecapText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  // Get contract address for current chain
  const contractAddress = chain?.id === base.id 
    ? CONTRACT_ADDRESSES.base 
    : CONTRACT_ADDRESSES.baseSepolia;

  // Check if user can submit today
  const { data: canSubmit } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DAILY_RECAP_ABI,
    functionName: 'canSubmitToday',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recapText.trim() || !address || !contractAddress) return;

    try {
      setIsSubmitting(true);
      
      // Create hash of the recap content
      const contentHash = keccak256(toBytes(recapText));
      
      // Submit to contract
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: DAILY_RECAP_ABI,
        functionName: 'submitRecap',
        args: [contentHash],
      });
    } catch (err) {
      console.error('Error submitting recap:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="mb-4 text-gray-600">Connect your wallet to submit a daily recap</p>
          <ConnectButton />
        </div>
      ) : (
        <>
          {contractAddress === '0x0000000000000000000000000000000000000000' ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                ⚠️ Contract not deployed yet. Please deploy the contract first.
              </p>
            </div>
          ) : canSubmit === false ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                ✅ You&apos;ve already submitted your recap today. Come back tomorrow!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recap" className="block text-sm font-medium text-gray-700 mb-2">
                  What did you accomplish today?
                </label>
                <textarea
                  id="recap"
                  value={recapText}
                  onChange={(e) => setRecapText(e.target.value)}
                  placeholder="Write a short recap of your day... (e.g., 'Built a new feature, learned React hooks, shipped v1.0')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={280}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {recapText.length}/280 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={!recapText.trim() || isPending || isConfirming}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Anchor Recap on Base'}
              </button>
            </form>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                Error: {error.message}
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Recap successfully anchored on Base!
              </p>
              {hash && (
                <a
                  href={`${chain?.id === base.id ? 'https://basescan.org' : 'https://sepolia.basescan.org'}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  View transaction →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
