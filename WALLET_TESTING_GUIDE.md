# 🔐 Wallet Testing Guide for Supply Chain Roles

## ⚠️ IMPORTANT SECURITY NOTICE
**These are TEST WALLETS ONLY - Never use these private keys on mainnet or with real funds!**

## 🎭 Role-Based Wallet Addresses

### 1. 🌾 **PRODUCER/FARMER** 
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Role: producer, farmer
```

### 2. 🔍 **QUALITY INSPECTOR/VALIDATOR**
```  
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Role: validator, quality_inspector
```

### 3. 🚛 **DISTRIBUTOR**
```
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Role: distributor
```

### 4. 🏪 **RETAILER**
```  
Address: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
Role: retailer
```

### 5. 🛒 **CONSUMER**
```
Address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
Role: consumer
```

## 🔧 Setup Instructions

### Step 1: Import Wallets to MetaMask

1. **Open MetaMask Extension**
2. Click on your account circle (top right)
3. Select "Import Account"
4. Choose "Private Key"
5. Paste one of the private keys above
6. Click "Import"
7. Rename the account to match the role (e.g., "Farmer", "Inspector", etc.)

### Step 2: Connect to Local Blockchain

1. **Add Local Network to MetaMask:**
   - Network Name: `Anvil Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Start Anvil (if using blockchain features):**
   ```bash
   anvil --host 0.0.0.0 --chain-id 31337
   ```

### Step 3: Registration Process

For each wallet address, complete registration:

1. **Switch to the wallet** in MetaMask
2. **Go to** `http://localhost:5173/register`
3. **Complete 3-step registration:**
   - Step 1: Basic Info (name, email, phone)
   - Step 2: Role Selection (choose appropriate role)
   - Step 3: Wallet Connection (connect current MetaMask account)

## 🧪 Complete Testing Flow

### Phase 1: Product Creation (Farmer Wallet)
```bash
1. Switch to Farmer wallet (0xf39F...)
2. Login at /login
3. Navigate to Farmer Dashboard
4. Click "Add Product"
5. Fill product details (AI will help)
6. Submit product
7. Note the QR code generated
```

### Phase 2: Product Validation (Inspector Wallet)
```bash
1. Switch to Inspector wallet (0x7099...)
2. Login at /login  
3. Navigate to Validator Dashboard
4. View pending products
5. Click "Approve Product" or "Reject Product"
6. Product status updates in database
```

### Phase 3: Distribution (Distributor Wallet)
```bash
1. Switch to Distributor wallet (0x3C44...)
2. Login at /login
3. Navigate to Distributor Dashboard
4. View approved products
5. Accept for distribution
```

### Phase 4: Retail (Retailer Wallet)
```bash
1. Switch to Retailer wallet (0x90F7...)
2. Login at /login
3. Navigate to Retailer Dashboard  
4. View distributed products
5. Accept for retail sale
```

### Phase 5: Consumer Verification (Consumer Wallet)
```bash
1. Switch to Consumer wallet (0x15d3...)
2. Use QR Scanner component
3. Scan product QR code
4. View complete supply chain history
```

## 🔄 Quick Wallet Switching Guide

### In MetaMask:
1. Click account circle
2. Select different imported account
3. Refresh your web application
4. The system will detect the new wallet
5. Login with credentials for that role

### Account Mapping:
- **Farmer**: Use wallet ending in ...2266
- **Inspector**: Use wallet ending in ...79C8  
- **Distributor**: Use wallet ending in ...93BC
- **Retailer**: Use wallet ending in ...b906
- **Consumer**: Use wallet ending in ...6A65

## 🛡️ Security Best Practices

1. **NEVER use these keys on mainnet**
2. **Only for local testing**
3. **Don't send real ETH to these addresses**
4. **Clear browser data after testing**
5. **Use fresh wallets for production**

## 🚀 Start Testing Commands

```bash
# Terminal 1: Backend
cd backend/backend  
npm run dev

# Terminal 2: Frontend
cd fork-trust
npm run dev

# Terminal 3: Blockchain (optional)
anvil --host 0.0.0.0 --chain-id 31337
```

## 📞 Testing Checklist

- [ ] All 5 wallets imported to MetaMask
- [ ] Local network configured (Chain ID: 31337)
- [ ] Each wallet registered with appropriate role
- [ ] Backend server running (port 4000)
- [ ] Frontend server running (port 5173)
- [ ] Anvil blockchain running (port 8545) - optional
- [ ] Database connected (MongoDB)

## 🎯 Expected Flow Results

1. **Farmer creates product** → Status: "pending"
2. **Inspector approves** → Status: "approved", validatorsApproved += 1  
3. **Distributor accepts** → Status: "distributed"
4. **Retailer accepts** → Status: "retail"
5. **Consumer scans QR** → Shows complete journey

---

🎉 **Your system is now ready for complete end-to-end supply chain testing!**

Remember: These are development/testing wallets only. Never use them with real cryptocurrency!