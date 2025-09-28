import { ethers } from 'ethers';

// Contract configuration - Update these with your actual contract details
// Contract configuration
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Updated with deployed address
export const RPC_URL = "http://127.0.0.1:8545";

// Smart Contract ABI - Copy from your SIH project
export const CONTRACT_ABI = [
  "function i_owner() view returns (address)",
  "function nextProductId() view returns (uint256)",
  "function isProducerRegistered(address) view returns (bool)",
  "function isQualityInspectorRegistered(address) view returns (bool)",
  "function isDistributorRegistered(address) view returns (bool)",
  "function isRetailerRegistered(address) view returns (bool)",
  "function createProduct(string name, string batchId, string category, uint256 productionDate, string metadataURI) external returns (uint256)",
  "function getBasicProductInfo(uint256 productId) view returns (string, string, string, address, uint256, uint256, bool)",
  "function approveQuality(uint256 productId, uint256 expiryDate) external",
  "function assignDistributor(uint256 productId, address distributor) external",
  "function assignRetailer(uint256 productId, address retailer) external",
  "function sellToConsumer(uint256 productId, address buyer) external",
  "function registerProducer(address _producer, string calldata _details) external",
  "function registerQualityInspector(address _inspector, string calldata _details) external",
  "function registerDistributor(address _distributor, string calldata _details) external",
  "function registerRetailer(address _retailer, string calldata _details) external",
  "function getOwnershipHistory(uint256 productId) external view returns (address[] memory, uint256[] memory)",
  "function getProducerDetails(address producer) view returns (string memory)",
  "function getQualityInspectorDetails(address inspector) view returns (string memory)",
  "function getDistributorDetails(address distributor) view returns (string memory)",
  "function getRetailerDetails(address retailer) view returns (string memory)",
  "function totalProducers() view returns (uint256)",
  "function totalQualityInspectors() view returns (uint256)",
  "function totalDistributors() view returns (uint256)",
  "function totalRetailers() view returns (uint256)"
];

// Initialize Web3 connection
export const initWeb3 = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not found. Please install MetaMask.");
    }

    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    return { provider, signer, contract, account };
  } catch (error) {
    console.error("Web3 initialization failed:", error);
    throw error;
  }
};

// Check if wallet is connected
export const isWalletConnected = async () => {
  try {
    if (!window.ethereum) return false;
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
    return accounts.length > 0;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return false;
  }
};

// Get network information
export const getNetworkInfo = async () => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  } catch (error) {
    console.error("Error getting network info:", error);
    throw error;
  }
};

// Switch to correct network (for local development)
export const switchToLocalNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7a69' }], // 31337 in hex (Anvil default)
    });
  } catch (switchError: unknown) {
    // This error code indicates that the chain has not been added to MetaMask
    if ((switchError as { code?: number }).code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x7a69',
              chainName: 'Local Anvil',
              rpcUrls: ['http://127.0.0.1:8545'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        console.error("Failed to add network:", addError);
        throw addError;
      }
    } else {
      console.error("Failed to switch network:", switchError);
      throw switchError;
    }
  }
};

// Format address for display
export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Convert timestamp to readable date
export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};