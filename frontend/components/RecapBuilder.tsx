'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { keccak256, toBytes } from 'viem';
import { DAILY_RECAP_ABI, CONTRACT_ADDRESSES } from '@/contracts/DailyRecap';
import { base, baseSepolia } from 'wagmi/chains';
import { fetchBaseActivity, buildRecap, getDayId, type RecapBullets } from '@/lib/baseActivity';

interface RecapData {
  dayId: number;
  address: string;
  bullets: string[];
  meaning: string;
  stats: {
    txCount: number;
    uniqueContracts: number;
    netEthChange: string;
  };
  createdAt: number;
}

export default function RecapBuilder() {
  const { address, isConnected, chain } = useAccount();
  const [step, setStep] = useState<'connect' | 'fetching' | 'edit' | 'submit' | 'done'>('connect');
  const [recap, setRecap] = useState<RecapBullets | null>(null);
  const [bullets, setBullets] = useState<string[]>([]);
  const [meaning, setMeaning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const contractAddress = chain?.id === base.id 
    ? CONTRACT_ADDRESSES.base 
    : CONTRACT_ADDRESSES.baseSepolia;

  useEffect(() => {
    if (isConnected && address && step === 'connect') {
      fetchActivity();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConfirmed && hash) {
      setTxHash(hash);
      setStep('done');
    }
  }, [isConfirmed, hash]);

  const fetchActivity = async () => {
    if (!address || !chain) return;
    
    setStep('fetching');
    setIsLoading(true);
    
    try {
      const { activity, hasBasescanData } = await fetchBaseActivity(address, chain.id);
      const generated = buildRecap(activity, address, hasBasescanData);
      setRecap(generated);
      setBullets(generated.bullets);
      setStep('edit');
    } catch (error) {
      console.error('Error fetching activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!address || !recap) return;
    
    const dayId = getDayId();
    const recapData: RecapData = {
      dayId,
      address,
      bullets,
      meaning,
      stats: recap.stats,
      createdAt: Date.now(),
    };
    
    // Create hash
    const recapJson = JSON.stringify(recapData);
    const recapHash = keccak256(toBytes(recapJson));
    
    // Store recap JSON off-chain first
    try {
      await fetch('/api/recaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recapHash, recapData }),
      });
    } catch (error) {
      console.error('Error storing recap:', error);
    }
    
    // Also store in localStorage as backup
    localStorage.setItem(`recap_${address}_${dayId}`, recapJson);
    
    // Submit to contract (contract computes dayId from block.timestamp)
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: DAILY_RECAP_ABI,
      functionName: 'submitRecap',
      args: [recapHash],
    });
    
    setStep('submit');
  };

  const copyText = () => {
    const text = `Daily Proof Card\n\n${bullets.join('\n')}\n\nMeaning: ${meaning}\n\nAnchored on Base`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const copyLink = () => {
    const url = window.location.origin + `/dashboard`;
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  };

  if (!isConnected) {
    return (
      <div className="text-center p-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect to Start</h2>
        <p className="text-gray-600 mb-6">Connect your wallet to generate today's proof card</p>
        <ConnectButton />
      </div>
    );
  }

  if (step === 'fetching') {
    return (
      <div className="text-center p-12">
        <div className="text-6xl mb-4 animate-bounce">⚡</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fetching Your Activity</h2>
        <p className="text-gray-600">Analyzing your Base transactions from the last 24 hours...</p>
      </div>
    );
  }

  if (step === 'edit' && recap) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">📊 Your Activity Summary</h3>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white/70 p-3 rounded">
              <div className="text-gray-600">Transactions</div>
              <div className="text-2xl font-bold text-green-700">{recap.stats.txCount}</div>
            </div>
            <div className="bg-white/70 p-3 rounded">
              <div className="text-gray-600">Contracts</div>
              <div className="text-2xl font-bold text-green-700">{recap.stats.uniqueContracts}</div>
            </div>
            <div className="bg-white/70 p-3 rounded">
              <div className="text-gray-600">Net ETH</div>
              <div className="text-2xl font-bold text-green-700">{recap.stats.netEthChange}</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Edit Your Proof Card (3 bullets)
          </label>
          {bullets.map((bullet, i) => (
            <div key={i} className="mb-3">
              <input
                type="text"
                value={bullet}
                onChange={(e) => {
                  const newBullets = [...bullets];
                  newBullets[i] = e.target.value;
                  setBullets(newBullets);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`Bullet ${i + 1}`}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Meaning (1 sentence)
          </label>
          <input
            type="text"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="What did this mean to you today?"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{meaning.length}/200</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!meaning.trim() || isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg"
        >
          {isPending ? 'Confirming...' : 'Anchor on Base 🚀'}
        </button>
      </div>
    );
  }

  if (step === 'done' && txHash) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border-2 border-green-300">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">✅</div>
            <h2 className="text-3xl font-bold text-green-900 mb-2">Proof Card Anchored!</h2>
            <p className="text-green-700">Your daily activity is now on-chain</p>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Today's Proof Card</h3>
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-800">{bullet}</span>
              </div>
            ))}
            {meaning && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Meaning:</div>
                <div className="text-gray-900 italic">&quot;{meaning}&quot;</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={copyText}
              className="py-3 px-4 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              📋 Copy Text
            </button>
            <button
              onClick={copyLink}
              className="py-3 px-4 bg-white border-2 border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              🔗 Copy Link
            </button>
          </div>

          <a
            href={`${chain?.id === base.id ? 'https://basescan.org' : 'https://sepolia.basescan.org'}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-4 text-blue-600 hover:underline text-sm"
          >
            View on Basescan →
          </a>
        </div>
      </div>
    );
  }

  return null;
}
