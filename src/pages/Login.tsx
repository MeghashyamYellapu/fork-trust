import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Smartphone, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { WalletConnection } from '@/components/WalletConnection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { initWeb3, CONTRACT_ABI, CONTRACT_ADDRESS } from '@/utils/web3';
import { ethers } from 'ethers';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp' | 'wallet'>('wallet');
  const [formData, setFormData] = useState({
    phoneOrEmail: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Blockchain wallet login
  const handleWalletLogin = async (address: string) => {
    setWalletAddress(address);
    setIsLoading(true);
    
    try {
      console.log('🔍 Attempting wallet login with address:', address);
      
      // First, check if user exists in backend with this wallet address
      const response = await fetch('http://localhost:4000/api/auth/wallet-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address
        })
      });

      const data = await response.json();
      console.log('🔍 Wallet login response:', { status: response.status, data });

      if (response.ok && data.success) {
        // User found in backend database
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Wallet Login Successful",
          description: `Welcome back, ${data.user.fullName}!`,
        });

        // Navigate based on user role from database
        const roleRoutingMap: { [key: string]: string } = {
          'producer': '/dashboard/farmer',
          'quality-inspector': '/dashboard/validator', 
          'distributor': '/dashboard/distributor',
          'retailer': '/dashboard/retailer',
          'consumer': '/dashboard/consumer'
        };

        const route = roleRoutingMap[data.user.role] || '/';
        navigate(route);
      } else {
        // User not found in backend, show helpful message
        console.log('❌ Wallet not found in database. Response:', data.message);
        
        toast({
          title: "Wallet Not Registered",
          description: `This wallet address is not linked to any account. Please register or use a different login method.`,
          variant: "default"
        });
        
        // Suggest registration with pre-filled wallet
        navigate('/register', { 
          state: { 
            walletAddress: address,
            fromWalletLogin: true
          } 
        });
      }
      
    } catch (error) {
      console.error('❌ Wallet login error:', error);
      toast({
        title: "Wallet Login Failed", 
        description: "Please ensure you're connected to the correct network and the backend server is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!formData.phoneOrEmail) {
      setErrors(prev => ({ ...prev, phoneOrEmail: 'Please enter your phone number' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneOrEmail: formData.phoneOrEmail
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the OTP",
        });
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setErrors(prev => ({ ...prev, phoneOrEmail: errorMessage }));
      toast({
        title: "Failed to send OTP",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.phoneOrEmail.trim()) {
      newErrors.phoneOrEmail = 'Phone number or email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Real backend authentication
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneOrEmail: formData.phoneOrEmail,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.fullName}!`,
        });

        // Navigate based on user role
        const roleRoutingMap: { [key: string]: string } = {
          'producer': '/dashboard/farmer',
          'quality-inspector': '/dashboard/validator', 
          'distributor': '/dashboard/distributor',
          'retailer': '/dashboard/retailer',
          'consumer': '/dashboard/consumer'
        };

        const route = roleRoutingMap[data.user.role] || '/';
        navigate(route);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setErrors({ password: errorMessage });
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      await sendOTP();
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter 6-digit OTP' }));
      return;
    }

    setIsLoading(true);
    try {
      // Real OTP verification with backend
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneOrEmail: formData.phoneOrEmail,
          otp: formData.otp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "OTP Verified",
          description: `Welcome, ${data.user.fullName}!`,
        });

        // Navigate based on user role
        const roleRoutingMap: { [key: string]: string } = {
          'producer': '/dashboard/farmer',
          'quality-inspector': '/dashboard/validator', 
          'distributor': '/dashboard/distributor',
          'retailer': '/dashboard/retailer',
          'consumer': '/dashboard/consumer'
        };

        const route = roleRoutingMap[data.user.role] || '/';
        navigate(route);
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
      setErrors({ otp: errorMessage });
      toast({
        title: "OTP Verification Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="card-elevated">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('welcomeBack')}</h1>
              <p className="text-muted-foreground">{t('signInToAccount')}</p>
            </div>

            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'password' | 'otp' | 'wallet')}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="wallet" className="text-sm">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="password" className="text-sm">
                  <Lock className="w-4 h-4 mr-2" />
                  {t('password')}
                </TabsTrigger>
                <TabsTrigger value="otp" className="text-sm">
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t('otp')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Connect with MetaMask</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Connect your wallet to access your blockchain role
                    </p>
                  </div>
                  <WalletConnection onConnect={handleWalletLogin} />
                </div>
              </TabsContent>

              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="phoneOrEmail" className="text-large">
                      {t('phoneOrEmailLabel')}
                    </Label>
                    <Input
                      id="phoneOrEmail"
                      value={formData.phoneOrEmail}
                      onChange={(e) => handleInputChange('phoneOrEmail', e.target.value)}
                      className="mt-2 text-lg"
                      placeholder={t('enterPhoneOrEmail')}
                    />
                    {errors.phoneOrEmail && <p className="text-error text-sm mt-1">{errors.phoneOrEmail}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-large">
                      {t('password')}
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="text-lg pr-12"
                        placeholder={t('enterPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div className="text-right">
                    <Button 
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm text-primary"
                      onClick={() => {
                        // TODO: Implement forgot password
                        console.log('Forgot password clicked');
                      }}
                    >
                      {t('forgotPassword')}
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? t('verifying') : t('signIn')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <form onSubmit={handleOTPLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="phoneNumberOTP" className="text-large">
                      {t('phoneOrEmailLabel')}
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="phoneNumberOTP"
                        value={formData.phoneOrEmail}
                        onChange={(e) => handleInputChange('phoneOrEmail', e.target.value)}
                        className="text-lg"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        disabled={otpSent}
                      />
                      {!otpSent && (
                        <Button 
                          type="button" 
                          onClick={sendOTP}
                          disabled={isLoading}
                          variant="outline"
                          className="whitespace-nowrap"
                        >
                          {isLoading ? t('sending') : t('sendOTP')}
                        </Button>
                      )}
                    </div>
                    {errors.phoneOrEmail && <p className="text-error text-sm mt-1">{errors.phoneOrEmail}</p>}
                  </div>

                  {otpSent && (
                    <div>
                      <Label htmlFor="otpInput" className="text-large">
                        {t('enterOtp')}
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="otpInput"
                          value={formData.otp}
                          onChange={(e) => handleInputChange('otp', e.target.value)}
                          className="text-lg"
                          placeholder="6-digit OTP"
                          maxLength={6}
                        />
                        <Button 
                          type="button" 
                          onClick={() => {
                            setOtpSent(false);
                            setFormData(prev => ({ ...prev, otp: '' }));
                          }}
                          variant="outline"
                          className="whitespace-nowrap"
                        >
                          {t('resend')}
                        </Button>
                      </div>
                      {errors.otp && <p className="text-error text-sm mt-1">{errors.otp}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        OTP sent to {formData.phoneOrEmail}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? t('verifying') : otpSent ? t('verifyAndSignIn') : t('sendOTP')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                {"Don't have an account?"}{' '}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/register')}
                  className="p-0 h-auto text-primary"
                >
                  {t('register')}
                </Button>
              </p>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-2">
                  Want secure blockchain-based access?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/blockchain-register')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  🔗 Register with Blockchain & Wallet
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;