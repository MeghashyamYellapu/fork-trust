// Simple base64 decode function as fallback
const base64UrlDecode = (str: string): string => {
  try {
    // Add padding if needed
    str += '=='.substring(0, (4 - str.length % 4) % 4);
    // Replace URL safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
  } catch (error) {
    throw new Error('Invalid base64 string');
  }
};

// Simple JWT decode function as fallback
const simpleJwtDecode = (token: string): DecodedToken => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = parts[1];
    const decoded = base64UrlDecode(payload);
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    throw new Error('Failed to decode JWT');
  }
};

interface DecodedToken {
  userId: string;
  role: string;
  walletAddress?: string;
  iat: number;
  exp: number;
}

export const getWalletAddress = (): string | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Use simple decode for now to avoid import issues
    const decoded = simpleJwtDecode(token);
    return decoded.walletAddress || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const formatWalletAddress = (address: string | null): string => {
  if (!address) return 'Not Connected';
  
  // Return first 6 and last 4 characters with ellipsis
  if (address.length > 10) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  return address;
};

export const getUserData = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return simpleJwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};