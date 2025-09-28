// Types for MetaMask/Ethereum provider
export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: unknown[]) => void) => void;
  selectedAddress: string | null;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Product information type
export interface ProductInfo {
  name: string;
  batchId: string;
  category: string;
  producer: string;
  productionDate: number;
  expiryDate: number;
  qualityApproved: boolean;
}

// Transaction receipt log type
export interface TransactionLog {
  topics: string[];
  data: string;
  address: string;
}

// Network information type
export interface NetworkInfo {
  chainId: number;
  name: string;
}

// User roles type
export type UserRole = 'Producer' | 'Quality Inspector' | 'Distributor' | 'Retailer' | 'User' | 'Not Connected' | 'Unknown';

// Product creation parameters
export interface CreateProductParams {
  name: string;
  batchId: string;
  category: string;
  productionDate: number;
  metadataURI?: string;
}

// Registration parameters
export interface RegistrationParams {
  address: string;
  details: string;
}