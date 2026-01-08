# RECAP - Daily Activity Anchoring on Base

A minimal Base app where users can connect their wallet, generate a short daily recap, and anchor it on Base blockchain as proof of activity.

## Features

- 🔗 **On-Chain Proof**: Permanently store your daily recaps on Base blockchain
- 📅 **Daily Limit**: One recap per day per address to encourage consistency
- 🚀 **Simple & Fast**: Clean UI with wallet connection via RainbowKit
- 💰 **No Tokens**: No token economics, no DAO - just ship v1
- ⛓️ **Base Network**: Built for Base mainnet and Base Sepolia testnet

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

The `DailyRecap.sol` contract stores:
- User address
- Timestamp
- Content hash (keccak256 of the recap text)

Key features:
- Validates one recap per day per address
- Stores recaps in both mapping and array for efficient queries
- Provides pagination for fetching latest recaps
- Emits events for off-chain indexing

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
 
