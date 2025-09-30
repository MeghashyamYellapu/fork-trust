// Test file to verify auth utilities work
import { getWalletAddress, formatWalletAddress, getUserData } from '../utils/auth';

// Mock a JWT token for testing
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzVhMzUyYjg0NGI3NDAwMjAzNGUyOGEiLCJyb2xlIjoicHJvZHVjZXIiLCJ3YWxsZXRBZGRyZXNzIjoiMHg5MGY3OWJmNmViMmM0Zjg3MDM2NWU3ODU5ODJlMWYxMDFlOTNiOTA2IiwiaWF0IjoxNzMzNzkxNTkxLCJleHAiOjE3MzM4Nzc5OTF9.fakesignature';

// Test the functions
console.log('Testing Auth Utilities:');

// Store mock token
localStorage.setItem('token', mockToken);

// Test wallet address extraction
const walletAddress = getWalletAddress();
console.log('Wallet Address:', walletAddress);

// Test wallet formatting
const formattedAddress = formatWalletAddress(walletAddress);
console.log('Formatted Address:', formattedAddress);

// Test user data extraction
const userData = getUserData();
console.log('User Data:', userData);

// Cleanup
localStorage.removeItem('token');

export {}; // Make this a module