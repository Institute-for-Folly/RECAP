# RECAP Deployment Guide

This guide will walk you through deploying the RECAP app to Base network.

## Prerequisites

1. Node.js 18+ installed
2. A wallet with Base Sepolia ETH (for testnet) or Base ETH (for mainnet)
3. Private key of your deployment wallet
4. Basescan API key (optional, for contract verification)
5. WalletConnect Project ID (for frontend wallet connection)

## Step 1: Setup Environment Variables

### For Smart Contract Deployment

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your credentials:
```
PRIVATE_KEY=your_wallet_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

### For Frontend

Create `.env.local` in the `frontend` directory:

```bash
cd frontend
cp .env.example .env.local
```

Add your WalletConnect Project ID:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

## Step 2: Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Deploy Smart Contract

### Deploy to Base Sepolia (Testnet)

1. Get Base Sepolia ETH from a faucet:
   - https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

2. Deploy the contract:
```bash
npm run deploy:sepolia
```

3. Save the deployed contract address from the output.

### Deploy to Base Mainnet

1. Ensure you have Base ETH in your wallet

2. Deploy the contract:
```bash
npm run deploy:base
```

3. Save the deployed contract address.

### Verify Contract (Optional)

After deployment, verify your contract on Basescan:

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

or for mainnet:

```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

## Step 4: Update Frontend Configuration

1. Open `frontend/contracts/DailyRecap.ts`

2. Update the contract addresses with your deployed addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  base: '0xYourMainnetAddress',
  baseSepolia: '0xYourSepoliaAddress',
} as const;
```

3. Commit these changes:
```bash
git add frontend/contracts/DailyRecap.ts
git commit -m "Update contract addresses"
git push
```

## Step 5: Test Frontend Locally

```bash
npm run frontend:dev
```

Open http://localhost:3000 and test:
- Wallet connection
- Network switching (Base/Base Sepolia)
- Submitting a recap
- Checking daily limit

## Step 6: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Follow the prompts to deploy
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### Option B: Deploy to Netlify

1. Build the frontend:
```bash
npm run frontend:build
```

2. Deploy the `frontend/.next` directory to Netlify

3. Set environment variable:
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### Option C: Self-host

1. Build the frontend:
```bash
npm run frontend:build
```

2. Start the production server:
```bash
npm run frontend:start
```

3. Use a process manager like PM2 for production:
```bash
npm install -g pm2
cd frontend
pm2 start npm --name "recap" -- start
```

## Step 7: Post-Deployment Checklist

- [ ] Contract deployed and verified on Basescan
- [ ] Frontend deployed and accessible
- [ ] Wallet connection working
- [ ] Test submit recap transaction
- [ ] Test daily limit enforcement
- [ ] Check transaction links on Basescan
- [ ] Update README with live URLs

## Troubleshooting

### Contract Deployment Issues

**Error: Insufficient funds**
- Ensure your wallet has enough Base ETH for gas

**Error: Invalid nonce**
- Clear pending transactions in your wallet

### Frontend Issues

**Wallet not connecting**
- Check WalletConnect Project ID is set
- Verify network configuration in `config/wagmi.ts`

**Contract not found**
- Ensure contract addresses are updated in `DailyRecap.ts`
- Verify you're on the correct network

**Transaction failing**
- Check if you've already submitted today
- Ensure recap text is not empty
- Verify contract has gas

## Production Best Practices

1. **Security**
   - Never commit private keys
   - Use environment variables for sensitive data
   - Test on testnet first

2. **Monitoring**
   - Set up analytics (Vercel Analytics, Google Analytics)
   - Monitor contract events on Basescan
   - Track gas costs

3. **Optimization**
   - Enable caching in production
   - Optimize images and assets
   - Consider using a CDN

4. **Backup**
   - Keep deployment credentials secure
   - Document all configuration
   - Save contract addresses and transaction hashes

## Need Help?

- Contract not deploying? Check your Base ETH balance
- Frontend issues? Check browser console for errors
- Questions? Open an issue on GitHub

## Next Steps

After successful deployment:
1. Share your app with users
2. Gather feedback
3. Consider implementing cool add-ons from the roadmap
4. Monitor usage and gas costs
5. Iterate based on user feedback
