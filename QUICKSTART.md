# Quick Start Guide

Get RECAP running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A wallet (MetaMask, Rainbow, etc.)

## Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Institute-for-Folly/RECAP.git
cd RECAP
npm install
cd frontend
npm install
cd ..
```

2. **Set up environment variables:**

Frontend only (for local development):
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID (get one free at https://cloud.walletconnect.com/):
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

3. **Run the frontend:**
```bash
npm run frontend:dev
```

4. **Open your browser:**
```
http://localhost:3000
```

## What You'll See

Since the contract isn't deployed yet, you'll see a warning message. That's expected!

To fully test the app:
1. Deploy the contract (see DEPLOYMENT.md)
2. Update the contract address in `frontend/contracts/DailyRecap.ts`
3. Restart the dev server

## Testing Without Deployment

You can still:
- ✅ View the UI
- ✅ Connect your wallet
- ✅ See the form
- ❌ Submit transactions (requires deployed contract)

## Next Steps

1. **Deploy to Testnet**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to Base Sepolia
2. **Test the App**: Submit your first recap on testnet
3. **Deploy to Production**: Deploy contract to Base mainnet
4. **Ship It**: Deploy frontend to Vercel

## Need Help?

- Read the full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub

## Quick Commands

```bash
# Run frontend dev server
npm run frontend:dev

# Build frontend for production
npm run frontend:build

# Deploy contract to Base Sepolia (requires setup)
npm run deploy:sepolia

# Run contract tests
npm run test
```

That's it! You're ready to start building with RECAP. 🚀
