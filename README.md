# RECAP - Daily Proof Cards on Base

**Auto-generate proof cards from your Base on-chain activity.** Anchor your daily activity with context and meaning on Base blockchain.

## 🎯 What RECAP Is Now (v1.5)

RECAP transforms your Base blockchain activity into **Daily Proof Cards** - verifiable, shareable summaries of what you did on-chain.

### How It Works

1. **Connect Wallet** - Connect to Base or Base Sepolia
2. **Auto-Fetch Activity** - We analyze your last 24 hours of transactions
3. **Generate Proof Card** - Get 3 bullet highlights + stats automatically
4. **Add Meaning** - Add a personal 1-sentence reflection
5. **Anchor On-Chain** - Store the recap hash on Base (one per day)
6. **Share** - Copy text, link, or view on Basescan

### Example Proof Card

```
• Made 12 transactions on Base
• Actions: 3 swaps, 2 mints, 7 transfers
• Interacted with 5 unique contracts

Meaning: "Explored Base DeFi and minted my first NFT"

Stats: 12 tx | 5 contracts | -0.05 ETH
```

## dayId Computation

**dayId** is computed as: `floor(Date.now() / 86400000)`

This gives us a UTC-based day bucket. Example:
- Jan 8, 2026 00:00 UTC = dayId 19361
- Jan 9, 2026 00:00 UTC = dayId 19362

One proof card per address per dayId is enforced on-chain.

## Why This Matters

**Before (Random Text):**
- ❌ User types random text, stores hash
- ❌ No connection to actual activity
- ❌ No context or verification
- ❌ Meaningless data

**Now (Proof Cards):**
- ✅ **Auto-generated from real Base activity**
- ✅ **Verifiable** - Activity is on-chain
- ✅ **Meaningful** - Shows what you actually did
- ✅ **Personal** - Add your reflection
- ✅ **Shareable** - Copy and share your proof

## Features

- 🏆 **Achievement System**: Post meaningful wins with categories
- 🔗 **Verifiable Proof**: Include links to prove your achievements
- 👥 **Community Validation**: Get likes and verification from others
- 📅 **Daily Limit**: One achievement per day to encourage quality
- 🎯 **Categories**: Code, Learning, Fitness, Business, Social, Creative
- 💰 **No Tokens**: No token economics, no DAO - just ship
- ⛓️ **Base Network**: Built for Base mainnet and Base Sepolia testnet

## Use Cases

**For Developers:**
- "Deployed my first smart contract" + link to Basescan
- "Merged my first PR to an open source project" + GitHub link
- "Launched my dapp to 100 users" + Twitter announcement

**For Creators:**
- "Released my first music NFT" + Sound.xyz link
- "Published my first article" + Mirror link
- "Launched my design portfolio" + website

**For Everyone:**
- "Completed my first marathon" + Strava proof
- "Hit 1K followers" + Farcaster profile
- "Launched my side project" + product link

## Project Structure

```
RECAP/
├── contracts/          # Solidity smart contract
│   └── DailyRecap.sol
├── scripts/           # Deployment scripts
│   └── deploy.js
├── test/             # Contract tests
│   └── DailyRecap.test.js
├── frontend/         # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── config/
│   └── contracts/
└── hardhat.config.js # Hardhat configuration
```

## Smart Contract

Two contract options:

### AchievementRecap.sol (NEW - Recommended)
Stores achievements with:
- User address
- Timestamp  
- Achievement title (e.g., "Deployed my first Base dapp")
- Category (Code, Learning, Fitness, Business, Social, Creative, Other)
- Proof link (optional URL for verification)
- Likes count
- Verification status (community validated)

Key features:
- Community likes and verification
- Category-based filtering
- Verifiable proof links
- Auto-verification after 3 community votes
- Achievement timeline for each user

### DailyRecap.sol (Original)
Simple version that stores:
- User address
- Timestamp
- Content hash only

Use this if you want minimal storage without categories or social features.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A wallet (MetaMask, Rainbow, etc.)
- Base Sepolia ETH for testnet deployment

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Institute-for-Folly/RECAP.git
cd RECAP
```

2. **Install contract dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

### Smart Contract Deployment

1. **Create a `.env` file in the root directory:**
```bash
cp .env.example .env
```

Add your configuration:
```
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

2. **Compile the contract:**
```bash
npx hardhat compile
```

3. **Deploy to Base Sepolia (testnet):**
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

4. **Deploy to Base mainnet:**
```bash
npx hardhat run scripts/deploy.js --network base
```

5. **Update contract address in frontend:**

After deployment, update the contract address in `frontend/contracts/DailyRecap.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  base: '0xYourDeployedAddressOnBase',
  baseSepolia: '0xYourDeployedAddressOnBaseSepolia',
};
```

### Frontend Development

1. **Configure environment variables:**
```bash
cd frontend
cp .env.example .env.local
```

Get a WalletConnect Project ID from https://cloud.walletconnect.com/ and add it:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

Run smart contract tests:
```bash
npx hardhat test
```

## Deployment

### Deploy Frontend

The frontend can be deployed to Vercel, Netlify, or any platform supporting Next.js:

**Vercel:**
```bash
cd frontend
vercel
```

**Build for production:**
```bash
npm run build
npm start
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" and choose your wallet provider
2. **Switch to Base**: Ensure you're on Base or Base Sepolia network
3. **Write Recap**: Enter your daily recap (max 280 characters)
4. **Submit**: Click "Anchor Recap on Base" to submit the transaction
5. **Confirm**: Approve the transaction in your wallet
6. **Done**: Your recap is now permanently on-chain!

## Cool Add-ons (Ideas for Future)

- 📊 **Global Feed**: See all recaps from the community
- 🏆 **Streak Achievements**: NFT badges for consistent submissions
- 📈 **Analytics Dashboard**: Visualize your progress over time
- 🔄 **Export/Share**: Download or share your recap history
- 🎨 **Customization**: Personalized themes and styles
- 🔔 **Notifications**: Reminders to submit daily recaps
- 🌐 **IPFS Storage**: Store full recap content on IPFS
- 👥 **Social Features**: Follow users, like recaps

## Technology Stack

**Smart Contract:**
- Solidity 0.8.24
- Hardhat
- OpenZeppelin (if needed)

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- wagmi v2
- RainbowKit
- viem
- TanStack Query

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project as you wish.

## Support

For issues and questions:
- Open an issue on GitHub
- Join our community discussions

## Acknowledgments

Built with ❤️ for the Base ecosystem
 
