import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { initWeb3, isWalletConnected } from '../utils/web3';
import { ethers } from 'ethers';
import type { ProductInfo, UserRole, TransactionLog } from '../types/blockchain';

interface BlockchainContextType {
  // Connection state
  isConnected: boolean;
  account: string | null;
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  
  // Loading states
  isLoading: boolean;
  isConnecting: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Contract functions
  createProduct: (name: string, batchId: string, category: string, productionDate: number, metadataURI?: string) => Promise<number>;
  registerProducer: (address: string, details: string) => Promise<void>;
  registerRetailer: (address: string, details: string) => Promise<void>;
  registerQualityInspector: (address: string, details: string) => Promise<void>;
  approveQuality: (productId: number, expiryDate: number) => Promise<void>;
  getProductInfo: (productId: number) => Promise<ProductInfo>;
  
  // Role checks
  getUserRole: () => Promise<UserRole>;
}

export const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      setIsLoading(true);
      const connected = await isWalletConnected();
      
      if (connected) {
        await initializeConnection();
      }
    } catch (err) {
      console.error('Error checking connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to check wallet connection');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConnection = async () => {
    try {
      const { provider: web3Provider, signer: web3Signer, contract: web3Contract, account: userAccount } = await initWeb3();
      
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(web3Contract);
      setAccount(userAccount);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error initializing connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Web3');
      throw err;
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      await initializeConnection();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setContract(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  // Contract interaction functions
  const createProduct = async (name: string, batchId: string, category: string, productionDate: number, metadataURI = ''): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.createProduct(name, batchId, category, productionDate, metadataURI);
      const receipt = await tx.wait();
      
      // Extract product ID from events
      const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id("ProductCreated(uint256,address)"));
      if (event) {
        const productId = parseInt(event.topics[1], 16);
        return productId;
      }
      
      throw new Error('Product creation failed - no ProductCreated event found');
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const registerProducer = async (address: string, details: string): Promise<void> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.registerProducer(address, details);
      await tx.wait();
    } catch (err) {
      console.error('Error registering producer:', err);
      throw err;
    }
  };

  const registerRetailer = async (address: string, details: string): Promise<void> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.registerRetailer(address, details);
      await tx.wait();
    } catch (err) {
      console.error('Error registering retailer:', err);
      throw err;
    }
  };

  const registerQualityInspector = async (address: string, details: string): Promise<void> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.registerQualityInspector(address, details);
      await tx.wait();
    } catch (err) {
      console.error('Error registering quality inspector:', err);
      throw err;
    }
  };

  const approveQuality = async (productId: number, expiryDate: number): Promise<void> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.approveQuality(productId, expiryDate);
      await tx.wait();
    } catch (err) {
      console.error('Error approving quality:', err);
      throw err;
    }
  };

  const getProductInfo = async (productId: number): Promise<any> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const info = await contract.getBasicProductInfo(productId);
      return {
        name: info[0],
        batchId: info[1],
        category: info[2],
        producer: info[3],
        productionDate: Number(info[4]),
        expiryDate: Number(info[5]),
        qualityApproved: info[6]
      };
    } catch (err) {
      console.error('Error getting product info:', err);
      throw err;
    }
  };

  const getUserRole = async (): Promise<string> => {
    if (!contract || !account) return 'Not Connected';
    
    try {
      if (await contract.isProducerRegistered(account)) return 'Producer';
      if (await contract.isQualityInspectorRegistered(account)) return 'Quality Inspector';
      if (await contract.isDistributorRegistered(account)) return 'Distributor';
      if (await contract.isRetailerRegistered(account)) return 'Retailer';
      return 'User';
    } catch (err) {
      console.error('Error getting user role:', err);
      return 'Unknown';
    }
  };

  const value: BlockchainContextType = {
    isConnected,
    account,
    contract,
    provider,
    signer,
    isLoading,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    createProduct,
    registerProducer,
    registerRetailer,
    registerQualityInspector,
    approveQuality,
    getProductInfo,
    getUserRole
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};