# Blockchain Integration

This directory contains all the smart contracts, deployment scripts, and utilities for the Supply Chain blockchain integration.

## 📁 Directory Structure

```
blockchain/
├── src/                    # Smart contracts
│   └── SupplyChain.sol     # Main supply chain contract
├── script/                 # Deployment scripts
│   └── DeploySupplyChain.s.sol
├── test/                   # Contract tests
├── lib/                    # Dependencies (forge-std, etc.)
├── foundry.toml           # Foundry configuration
├── deploy.bat             # Windows deployment script
├── deploy.sh              # Unix deployment script
├── start-blockchain.bat   # Windows blockchain starter
├── start-blockchain.sh    # Unix blockchain starter
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Start Local Blockchain

**Windows:**
```cmd
cd blockchain
start-blockchain.bat
```

**Unix/macOS:**
```bash
cd blockchain
chmod +x start-blockchain.sh
./start-blockchain.sh
```

### 2. Deploy Smart Contracts

**Windows:**
```cmd
cd blockchain
deploy.bat
```

**Unix/macOS:**
```bash
cd blockchain
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Manual Commands

If you prefer to run commands manually:

### Start Anvil (Local Blockchain)
```bash
../foundry/anvil --host 0.0.0.0 --port 8545
```

### Deploy Contracts
```bash
../foundry/forge script script/DeploySupplyChain.s.sol \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

### Compile Contracts
```bash
../foundry/forge build
```

### Run Tests
```bash
../foundry/forge test
```

## 📋 Contract Information

### SupplyChain.sol
The main smart contract that handles:
- Product registration by producers
- Quality certification by inspectors
- Supply chain tracking
- Role-based access control

### Key Functions:
- `addProduct(name, description, price, origin)` - Add new product
- `certifyProduct(productId, isApproved, notes)` - Quality certification
- `registerProducer(producerAddress)` - Register new producer
- `registerQualityInspector(inspectorAddress)` - Register quality inspector
- `registerRetailer(retailerAddress)` - Register retailer
- `registerDistributor(distributorAddress)` - Register distributor

### Roles:
- **Producer**: Can add products to the supply chain
- **Quality Inspector**: Can approve/reject products
- **Retailer**: Can purchase approved products
- **Distributor**: Can handle product distribution

## 🔑 Default Test Accounts

When using Anvil, you get these pre-funded accounts:

```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

... (more accounts available)
```

## 🌐 Frontend Integration

After deployment, update these files with the contract address:

1. **src/utils/web3.ts**
   ```typescript
   const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
   ```

2. **.env.local**
   ```env
   VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
   ```

## 🛠️ Development Workflow

1. **Start blockchain**: Run `start-blockchain.bat/sh`
2. **Deploy contracts**: Run `deploy.bat/sh`
3. **Start frontend**: `npm run dev` (from parent directory)
4. **Test integration**: Use MetaMask with localhost:8545

## 📚 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)