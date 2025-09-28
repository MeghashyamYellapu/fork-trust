# 🚀 Complete Blockchain Integration Guide

This guide provides step-by-step instructions for setting up and running the Fork Trust supply chain application with blockchain integration.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Git (for version control)

## 🎯 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Blockchain
```bash
# Windows
npm run blockchain:start

# Or manually
cd blockchain
start-blockchain.bat
```

### 3. Deploy Smart Contracts
```bash
# Windows (in a new terminal)
npm run blockchain:deploy

# Or manually
cd blockchain
deploy.bat
```

### 4. Start Frontend
```bash
npm run dev
```

## 🔧 Detailed Setup

### Step 1: Environment Configuration

The `.env.local` file is already configured with:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_RPC_URL=http://localhost:8545
VITE_CHAIN_ID=31337
```

### Step 2: MetaMask Setup

1. **Install MetaMask** browser extension
2. **Add Local Network**:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account**:
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

### Step 3: Application Usage

1. **Navigate to Login Page**
2. **Select "Connect with Wallet" tab**
3. **Connect MetaMask**
4. **Register your role** (if needed):
   - Farmer/Producer
   - Quality Inspector
   - Retailer
   - Distributor

## 🏗️ Project Structure

```
fork-trust/
├── blockchain/                 # Smart contract files
│   ├── src/                   # Solidity contracts
│   ├── script/                # Deployment scripts
│   ├── test/                  # Contract tests
│   ├── lib/                   # Dependencies
│   ├── deploy.bat             # Windows deployment
│   ├── start-blockchain.bat   # Windows blockchain starter
│   └── README.md              # Blockchain documentation
├── src/
│   ├── components/
│   │   └── WalletConnection.tsx   # Wallet integration
│   ├── pages/
│   │   ├── Login.tsx              # Multi-method authentication
│   │   ├── FarmerDashboard.tsx    # Producer interface
│   │   └── ValidatorDashboard.tsx # Quality inspector interface
│   ├── utils/
│   │   └── web3.ts                # Web3 utilities
│   └── types/
│       └── blockchain.ts          # TypeScript definitions
└── foundry/                   # Foundry binaries
```

## 🔗 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Blockchain
- `npm run blockchain:start` - Start local blockchain
- `npm run blockchain:deploy` - Deploy contracts
- `npm run blockchain:build` - Compile contracts
- `npm run blockchain:test` - Run contract tests
- `npm run blockchain:abi` - Extract contract ABI

## 🎯 Features Implemented

### ✅ Farmer Dashboard
- **Wallet Connection**: MetaMask integration
- **Product Creation**: Add products to blockchain
- **Status Tracking**: Monitor validation status
- **Role Verification**: Producer authentication

### ✅ Validator Dashboard  
- **Quality Inspection**: Approve/reject products
- **Blockchain Voting**: Submit certifications
- **Inspector Verification**: Quality inspector authentication
- **Consensus Tracking**: View validation progress

### ✅ Login System
- **Multi-Method Auth**: Wallet, Password, OTP
- **Role Detection**: Automatic role identification
- **Secure Navigation**: Role-based routing

## 🛠️ Development Workflow

1. **Start Services**:
   ```bash
   # Terminal 1: Start blockchain
   npm run blockchain:start
   
   # Terminal 2: Deploy contracts (after blockchain is running)
   npm run blockchain:deploy
   
   # Terminal 3: Start frontend
   npm run dev
   ```

2. **Test Integration**:
   - Connect MetaMask to localhost:8545
   - Login with wallet
   - Create products as farmer
   - Validate products as inspector

3. **Debug Issues**:
   - Check browser console for errors
   - Verify MetaMask network settings
   - Ensure blockchain is running
   - Check contract deployment status

## 🔍 Testing Guide

### Test Accounts (Pre-funded)
```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8  
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### Test Scenarios

1. **Farmer Workflow**:
   - Login with wallet (Account #0)
   - Register as producer
   - Create new product
   - Monitor validation status

2. **Inspector Workflow**:
   - Switch to different account (Account #1)
   - Login with wallet
   - Register as quality inspector
   - Review pending products
   - Submit approval/rejection

3. **Cross-Role Testing**:
   - Test role restrictions
   - Verify transaction permissions
   - Check UI updates after blockchain transactions

## 📚 Smart Contract Functions

### Key Functions:
- `addProduct(name, description, price, origin)` - Add product
- `certifyProduct(productId, approved, notes)` - Quality check
- `registerProducer(address)` - Register producer
- `registerQualityInspector(address)` - Register inspector
- `getProductsByProducer(address)` - Get producer's products
- `getPendingProducts()` - Get products awaiting validation

## 🚨 Troubleshooting

### Common Issues:

1. **MetaMask Connection Failed**:
   - Check network configuration
   - Verify localhost:8545 is accessible
   - Try refreshing the page

2. **Contract Deployment Failed**:
   - Ensure Anvil is running
   - Check private key permissions
   - Verify contract compilation

3. **Transaction Failed**:
   - Check account has ETH balance
   - Verify contract address is correct
   - Ensure user has required role

4. **Frontend Build Errors**:
   - Run `npm install` to update dependencies
   - Check TypeScript compilation
   - Verify all imports are correct

## 🔄 Production Deployment

For production deployment:

1. **Update Environment Variables**:
   - Set mainnet/testnet RPC URL
   - Update contract address
   - Configure proper chain ID

2. **Deploy to Production Network**:
   ```bash
   # Update script for mainnet deployment
   forge script script/DeploySupplyChain.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
   ```

3. **Update Frontend Configuration**:
   - Update `web3.ts` with production settings
   - Configure proper network switching
   - Add error handling for mainnet

## 📞 Support

- **Documentation**: Check README files in each directory
- **Issues**: Create GitHub issues for bugs
- **Development**: Follow the development workflow above

---

**🎉 Your blockchain-integrated supply chain application is now ready for development and testing!**