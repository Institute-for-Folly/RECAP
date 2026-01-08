import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RECAP
              </Link>
              <div className="hidden sm:flex space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Create
                </Link>
                <Link href="/feed" className="text-gray-600 hover:text-gray-900">
                  Feed
                </Link>
                <Link href="/dashboard" className="text-blue-600 font-semibold">
                  Dashboard
                </Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Track your daily proof cards and streak</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-center text-gray-600">
            Dashboard features coming soon! Your proof cards are stored in localStorage and on-chain.
          </p>
        </div>
      </main>
    </div>
  );
}
