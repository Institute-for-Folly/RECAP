import RecapForm from '@/components/RecapForm';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RECAP
              </div>
              <span className="text-sm text-gray-500 hidden sm:inline">
                Daily Activity Anchoring on Base
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Anchor Your Daily Progress
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Write a short recap of your day and anchor it on Base blockchain as permanent proof of your activity.
            One recap per day, building your on-chain history.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <RecapForm />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900 mb-2">On-Chain Proof</h3>
            <p className="text-sm text-gray-600">
              Your recap is permanently stored on Base, creating an immutable record of your progress.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Daily Limit</h3>
            <p className="text-sm text-gray-600">
              Submit one recap per day to build consistency and track your journey over time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">Simple & Fast</h3>
            <p className="text-sm text-gray-600">
              No tokens, no complexity. Just connect your wallet and share your progress.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cool Add-ons (Coming Soon)</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="mr-2">📊</span>
              <span>Global feed of all recaps</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🏆</span>
              <span>Streak achievements & NFT badges</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📈</span>
              <span>Personal analytics dashboard</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🔄</span>
              <span>Export & share your progress</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
        <p>Built on Base • RECAP v1.0</p>
      </footer>
    </div>
  );
}
