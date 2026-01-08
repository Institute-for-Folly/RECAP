import AchievementForm from '@/components/AchievementForm';
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
                <span className="text-2xl">🏆</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RECAP
                </span>
              </Link>
              <div className="hidden sm:flex space-x-4">
                <Link href="/" className="text-blue-600 font-semibold">
                  Home
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <span className="text-sm font-semibold text-blue-800">✨ Achievement System on Base</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Prove Your Wins On-Chain
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Anchor your achievements, milestones, and wins on Base blockchain. 
            Get verified by the community. Build your credible on-chain resume.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Your Achievement</h2>
            <p className="text-gray-600">Share what you accomplished today and get community recognition</p>
          </div>
          <AchievementForm />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Verifiable Proof</h3>
            <p className="text-sm text-gray-600">
              Your achievements are permanently recorded on Base with optional proof links for validation.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Community Verified</h3>
            <p className="text-sm text-gray-600">
              Get likes and verifications from the community to boost your credibility.
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Build Your Resume</h3>
            <p className="text-sm text-gray-600">
              Create an immutable timeline of your wins, growth, and accomplishments.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🎨</span>
            Achievement Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '💻', label: 'Code', desc: 'Deployments, repos, PRs' },
              { icon: '📚', label: 'Learning', desc: 'Courses, certifications' },
              { icon: '💪', label: 'Fitness', desc: 'Workouts, marathons' },
              { icon: '💼', label: 'Business', desc: 'Launches, revenue' },
              { icon: '🌟', label: 'Social', desc: 'Followers, engagement' },
              { icon: '🎨', label: 'Creative', desc: 'Art, music, writing' },
              { icon: '✨', label: 'Other', desc: 'Whatever matters to you' },
            ].map((cat) => (
              <div key={cat.label} className="bg-white/70 backdrop-blur-sm p-4 rounded-lg text-center border border-gray-200">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{cat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✨</span>
            Why This Is Better
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">❌ Before (Boring)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Just random text hashes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>No context or meaning</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Can't verify authenticity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>No social interaction</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">✅ Now (Awesome)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Meaningful achievements</strong> with categories</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Verifiable proof</strong> links included</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Community validation</strong> with likes & verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Credible resume</strong> that proves your work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
        <p>Built on Base • RECAP v2.0 • Achievement-First Design 🏆</p>
      </footer>
    </div>
  );
}
