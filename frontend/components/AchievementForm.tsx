'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const categories = [
  { value: 0, label: 'Code', icon: '💻', color: 'bg-blue-100 text-blue-800' },
  { value: 1, label: 'Learning', icon: '📚', color: 'bg-purple-100 text-purple-800' },
  { value: 2, label: 'Fitness', icon: '💪', color: 'bg-red-100 text-red-800' },
  { value: 3, label: 'Business', icon: '💼', color: 'bg-green-100 text-green-800' },
  { value: 4, label: 'Social', icon: '🌟', color: 'bg-yellow-100 text-yellow-800' },
  { value: 5, label: 'Creative', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
  { value: 6, label: 'Other', icon: '✨', color: 'bg-gray-100 text-gray-800' },
];

const exampleAchievements = [
  { category: 0, title: 'Deployed my first smart contract', proof: 'basescan.org/tx/0x...' },
  { category: 1, title: 'Completed Solidity fundamentals course', proof: 'coursera.org/cert/...' },
  { category: 2, title: 'Ran my first 5K', proof: 'strava.com/activities/...' },
  { category: 3, title: 'Launched my MVP and got first customer', proof: 'twitter.com/...' },
  { category: 4, title: 'Hit 1,000 followers on Farcaster', proof: 'warpcast.com/...' },
  { category: 5, title: 'Released my first music NFT', proof: 'sound.xyz/...' },
];

export default function AchievementForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(0);
  const [proof, setProof] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // TODO: Replace with actual contract address and ABI
    console.log('Submitting achievement:', { title, category, proof });
    
    // For now, just show success
    alert('Achievement posted! 🎉');
    setTitle('');
    setProof('');
  };

  const useExample = (example: typeof exampleAchievements[0]) => {
    setTitle(example.title);
    setCategory(example.category);
    setProof(example.proof);
    setShowExamples(false);
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="mb-4 text-gray-600">Connect your wallet to post achievements</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            What did you achieve? 🎯
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Deployed my first Base dapp"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {title.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${category === cat.value 
                    ? 'border-blue-500 ' + cat.color + ' shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-2">
            Proof (optional)
          </label>
          <input
            type="text"
            id="proof"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Link to tweet, transaction, certificate, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            Share evidence of your achievement (link, screenshot, etc.)
          </p>
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isPending || isConfirming}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Post Achievement 🚀'}
        </button>
      </form>

      <button
        onClick={() => setShowExamples(!showExamples)}
        className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
      >
        {showExamples ? 'Hide examples' : 'Need inspiration? See examples'}
      </button>

      {showExamples && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-3">Click to use:</p>
          {exampleAchievements.map((example, i) => (
            <button
              key={i}
              onClick={() => useExample(example)}
              className="w-full text-left p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{categories[example.category].icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{example.title}</div>
                  <div className="text-xs text-gray-500 truncate">{example.proof}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
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
            ✅ Achievement posted on-chain!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Your achievement is now permanent and verifiable.
          </p>
        </div>
      )}
    </div>
  );
}
