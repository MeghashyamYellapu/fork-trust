#!/bin/bash

# SIH Integration Script
# This script helps integrate the fork-trust frontend with your SIH blockchain project

echo "🚀 SIH Integration Script"
echo "=========================="
echo ""

# Step 1: Environment Setup
echo "📋 Step 1: Environment Setup"
echo "-----------------------------"
echo "1. Copy this fork-trust folder to your SIH project:"
echo "   cp -r /path/to/fork-trust /path/to/sih/frontend"
echo ""
echo "2. Update your SIH project structure:"
echo "   sih-project/"
echo "   ├── src/                    # Smart contracts"
echo "   ├── script/                # Deployment scripts"
echo "   ├── test/                  # Contract tests"
echo "   ├── frontend/              # This fork-trust project"
echo "   └── foundry.toml           # Foundry config"
echo ""

# Step 2: Update Environment Variables
echo "📝 Step 2: Environment Variables"
echo "--------------------------------"
echo "Create .env.local in the frontend folder with:"
echo ""
cat > .env.local << EOL
# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CHAIN_ID=31337

# Application Configuration
VITE_APP_NAME="SIH Supply Chain"
VITE_APP_DESCRIPTION="Blockchain-powered transparency for supply chain management"
EOL
echo "✅ Created .env.local with blockchain configuration"
echo ""

# Step 3: Smart Contract Integration
echo "🔗 Step 3: Smart Contract Integration"
echo "------------------------------------"
echo "Copy your deployed contract ABI:"
echo "1. After deploying your contract, copy the ABI from:"
echo "   sih-project/out/SupplyChain.sol/SupplyChain.json"
echo ""
echo "2. Update src/utils/web3.ts with the correct:"
echo "   - CONTRACT_ADDRESS (from deployment)"
echo "   - CONTRACT_ABI (from the JSON file)"
echo ""

# Step 4: Dashboard Integration
echo "🏠 Step 4: Dashboard Integration"
echo "-------------------------------"
echo "The following dashboards need blockchain integration:"
echo ""
echo "FarmerDashboard.tsx:"
echo "  - Connect to Producer role in smart contract"
echo "  - Integrate product creation with blockchain"
echo "  - Add real-time blockchain data"
echo ""
echo "RetailerDashboard.tsx:"
echo "  - Connect to Retailer role in smart contract"
echo "  - Integrate inventory with blockchain products"
echo "  - Add purchase/sourcing from blockchain"
echo ""
echo "ValidatorDashboard.tsx:"
echo "  - Connect to Quality Inspector role"
echo "  - Add quality approval functionality"
echo "  - Integrate certification process"
echo ""

# Step 5: Testing Setup
echo "🧪 Step 5: Testing Setup"
echo "-----------------------"
echo "1. Start local blockchain (Anvil):"
echo "   cd sih-project && anvil"
echo ""
echo "2. Deploy contracts:"
echo "   forge script script/DeploySupplyChain.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast"
echo ""
echo "3. Update CONTRACT_ADDRESS in .env.local"
echo ""
echo "4. Start frontend development server:"
echo "   cd frontend && npm run dev"
echo ""

# Step 6: Code Examples
echo "💻 Step 6: Code Integration Examples"
echo "-----------------------------------"
echo ""
echo "Example: Integrating blockchain in FarmerDashboard.tsx"
echo ""
cat << 'EOF'
// Add blockchain imports
import { WalletConnection } from '@/components/WalletConnection';
import { useToast } from '@/hooks/use-toast';

// Add state for blockchain
const [walletAddress, setWalletAddress] = useState<string | null>(null);
const [isCreatingProduct, setIsCreatingProduct] = useState(false);
const { toast } = useToast();

// Handle product creation with blockchain
const handleCreateProduct = async (productData: any) => {
  if (!walletAddress) {
    toast({
      title: "Wallet Required",
      description: "Please connect your wallet first",
      variant: "destructive"
    });
    return;
  }

  try {
    setIsCreatingProduct(true);
    
    // Create product on blockchain
    const productionDate = Math.floor(Date.now() / 1000);
    // Call smart contract function here
    
    toast({
      title: "Product Created",
      description: "Product successfully added to blockchain",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create product on blockchain",
      variant: "destructive"
    });
  } finally {
    setIsCreatingProduct(false);
  }
};
EOF
echo ""

# Final Instructions
echo "🎯 Step 7: Final Integration Steps"
echo "---------------------------------"
echo "1. Install required dependencies:"
echo "   npm install ethers"
echo ""
echo "2. Update each dashboard component to:"
echo "   - Add wallet connection component"
echo "   - Integrate with smart contract functions"
echo "   - Add loading states and error handling"
echo "   - Update UI with real blockchain data"
echo ""
echo "3. Test the integration:"
echo "   - Connect MetaMask to local network (Chain ID: 31337)"
echo "   - Import test accounts from Anvil"
echo "   - Test user registration and role assignment"
echo "   - Test product creation and tracking"
echo ""
echo "4. Features to implement:"
echo "   ✅ Wallet connection"
echo "   ⭕ User role registration"
echo "   ⭕ Product creation on blockchain"
echo "   ⭕ Quality approval process"
echo "   ⭕ Supply chain tracking"
echo "   ⭕ QR code integration"
echo ""

echo "🎉 Integration Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Follow the steps above in order"
echo "2. Update CONTRACT_ADDRESS in .env.local after deployment"
echo "3. Test each dashboard with blockchain integration"
echo "4. Deploy to production when ready"
echo ""
echo "Need help? Check the INTEGRATION_GUIDE.md file for detailed instructions."