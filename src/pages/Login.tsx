import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [formData, setFormData] = useState({
    phoneOrEmail: '',
    password: '',
    otp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const sendOTP = async () => {
    if (!formData.phoneOrEmail) {
      setErrors(prev => ({ ...prev, phoneOrEmail: 'Please enter your phone number' }));
      return;
    }

    setIsLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      console.log('OTP sent to:', formData.phoneOrEmail);
    }, 1500);
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
    
    // Mock login - in real implementation, this would validate credentials
    setTimeout(() => {
      console.log('Login successful:', formData.phoneOrEmail);
      setIsLoading(false);
      
      // Mock role detection - in real implementation, this would come from backend
      const mockRole = 'farmer'; // This should be determined by the backend
      navigate(`/dashboard/${mockRole}`);
    }, 2000);
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
    
    // Mock OTP verification
    setTimeout(() => {
      console.log('OTP login successful:', formData.phoneOrEmail);
      setIsLoading(false);
      
      // Mock role detection
      const mockRole = 'farmer';
      navigate(`/dashboard/${mockRole}`);
    }, 2000);
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
            Back to Home
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="card-elevated">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'password' | 'otp')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="password" className="text-sm">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="otp" className="text-sm">
                  <Smartphone className="w-4 h-4 mr-2" />
                  OTP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <form onSubmit={handlePasswordLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="phoneOrEmail" className="text-large">
                      Phone Number or Email / ఫోన్ లేదా ఈమెయిల్ / फोन या ईमेल
                    </Label>
                    <Input
                      id="phoneOrEmail"
                      value={formData.phoneOrEmail}
                      onChange={(e) => handleInputChange('phoneOrEmail', e.target.value)}
                      className="mt-2 text-lg"
                      placeholder="Enter phone number or email"
                    />
                    {errors.phoneOrEmail && <p className="text-error text-sm mt-1">{errors.phoneOrEmail}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-large">
                      Password / పాస్‌వర్డ్ / पासवर्ड
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="text-lg pr-12"
                        placeholder="Enter your password"
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
                      Forgot Password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <form onSubmit={handleOTPLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="phoneNumberOTP" className="text-large">
                      Phone Number / ఫోన్ నంబర్ / फोन नंबर
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
                          {isLoading ? 'Sending...' : 'Send OTP'}
                        </Button>
                      )}
                    </div>
                    {errors.phoneOrEmail && <p className="text-error text-sm mt-1">{errors.phoneOrEmail}</p>}
                  </div>

                  {otpSent && (
                    <div>
                      <Label htmlFor="otpInput" className="text-large">
                        Enter OTP / OTP నమోదు చేయండి / OTP दर्ज करें
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
                          Resend
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
                    {isLoading ? 'Verifying...' : otpSent ? 'Verify & Sign In' : 'Send OTP'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/register')}
                  className="p-0 h-auto text-primary"
                >
                  Register here
                </Button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;