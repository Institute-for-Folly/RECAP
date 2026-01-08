import RecapBuilder from '@/components/RecapBuilder';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RECAP
                </span>
              </Link>
              <div className="hidden sm:flex space-x-4">
                <Link href="/" className="text-blue-600 font-semibold">
                  Create
                </Link>
                <Link href="/feed" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Feed
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
            <span className="text-sm font-semibold text-blue-800">⚡ Daily Proof Card on Base</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            Your On-Chain Activity, Proven
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Auto-generate a proof card from your Base transactions, add meaning, and anchor it on-chain.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100">
          <RecapBuilder />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Auto-Generated</h3>
            <p className="text-sm text-gray-600">
              Fetch your last 24h of Base activity and generate a proof card automatically.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-indigo-100">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Add Meaning</h3>
            <p className="text-sm text-gray-600">
              Edit bullets and add a personal reflection to give context to your activity.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="text-4xl mb-3">⛓️</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Anchor On-Chain</h3>
            <p className="text-sm text-gray-600">
              Store the hash on Base. One proof card per day. Permanent and verifiable.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">Connect Wallet</h4>
                <p className="text-sm text-gray-600">Connect to Base or Base Sepolia</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">Auto-Fetch Activity</h4>
                <p className="text-sm text-gray-600">We analyze your Base transactions from the last 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">Edit & Add Meaning</h4>
                <p className="text-sm text-gray-600">Review the generated bullets and add your personal reflection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-semibold text-gray-900">Anchor on Base</h4>
                <p className="text-sm text-gray-600">Submit the recap hash on-chain. One per day, forever verifiable.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
        <p>Built on Base • RECAP v1.5 • Daily Proof Cards 📊</p>
      </footer>
    </div>
  );
}
