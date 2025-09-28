import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface WalletConnectionProps {
  onConnect?: (account: string) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      const userAccount = accounts[0];
      setAccount(userAccount);
      
      if (onConnect) {
        onConnect(userAccount);
      }

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain:', chainId);

    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!account ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your MetaMask wallet to interact with the blockchain
            </p>
            <Button 
              onClick={connectWallet} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
            <Badge variant="secondary" className="w-full justify-center">
              {formatAddress(account)}
            </Badge>
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="w-full"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};