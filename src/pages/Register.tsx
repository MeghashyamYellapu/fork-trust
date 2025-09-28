import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { ArrowLeft, User, Phone, Lock, Eye, EyeOff, MapPin, Building, FileText, Users, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { WalletConnection } from '@/components/WalletConnection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { initWeb3, formatAddress } from '@/utils/web3';
import { ethers } from 'ethers';

type UserRole = 'producer' | 'distributor' | 'retailer' | 'quality-inspector' | 'consumer';

interface FormData {
  fullName: string;
  phoneNumber: string;
  aadharNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  
  // Location fields
  state?: string;
  district?: string;
  address?: string;
  pincode?: string;
  
  // Role-specific fields
  farmName?: string;
  farmLocation?: string;
  landSize?: string;
  cropTypes?: string;
  companyName?: string;
  businessName?: string;
  licenseNumber?: string;
  operatingRegion?: string;
  shopName?: string;
  shopLocation?: string;
  gstNumber?: string;
  organizationName?: string;
  designation?: string;
  validationId?: string;
  businessLicense?: string;
  certificationDetails?: string;
  experience?: string;
  preferredLanguage?: string;
  
  // Blockchain fields
  walletAddress?: string;
  blockchainRegistered?: boolean;
}

const Register = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isBlockchainConnected, setIsBlockchainConnected] = useState(false);
  const [isBlockchainRegistering, setIsBlockchainRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    aadharNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    state: '',
    district: '',
    address: '',
    pincode: '',
    walletAddress: '',
    blockchainRegistered: false,
  });

  const roles = [
    { 
      value: 'producer', 
      labelKey: 'Producer/Farmer', 
      icon: User, 
      color: 'bg-green-500', 
      hoverColor: 'hover:bg-green-600',
      description: 'Add products to supply chain'
    },
    { 
      value: 'distributor', 
      labelKey: 'Distributor', 
      icon: Building, 
      color: 'bg-blue-500', 
      hoverColor: 'hover:bg-blue-600',
      description: 'Manage product distribution'
    },
    { 
      value: 'retailer', 
      labelKey: 'Retailer', 
      icon: Building, 
      color: 'bg-purple-500', 
      hoverColor: 'hover:bg-purple-600',
      description: 'Sell products to consumers'
    },
    { 
      value: 'quality-inspector', 
      labelKey: 'Quality Inspector', 
      icon: FileText, 
      color: 'bg-orange-500', 
      hoverColor: 'hover:bg-orange-600',
      description: 'Validate and certify products'
    }
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  // Initialize blockchain connection
  useEffect(() => {
    const initBlockchain = async () => {
      try {
        const { contract: web3Contract, account } = await initWeb3();
        setContract(web3Contract);
        if (account) {
          setWalletAddress(account);
          setIsBlockchainConnected(true);
          setFormData(prev => ({ ...prev, walletAddress: account }));
        }
      } catch (error) {
        console.error('Blockchain initialization failed:', error);
        setIsBlockchainConnected(false);
      }
    };

    initBlockchain();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setIsBlockchainConnected(true);
    setFormData(prev => ({ ...prev, walletAddress: address }));
    toast({
      title: "Wallet Connected",
      description: "You can now register using blockchain",
    });
  };

  // Blockchain registration function
  const handleBlockchainRegistration = async () => {
    if (!contract || !walletAddress || !formData.role) {
      toast({
        title: "Error",
        description: "Please connect wallet and select a role",
        variant: "destructive"
      });
      return false;
    }

    setIsBlockchainRegistering(true);
    try {
      // Get the signer directly to avoid ENS resolution issues
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      let tx;
      
      switch (formData.role) {
        case 'producer':
          tx = await contractWithSigner.registerProducer(
            formData.fullName, 
            formData.farmLocation || formData.address || 'Location not specified'
          );
          break;
        case 'quality-inspector':
          tx = await contractWithSigner.registerQualityInspector(
            formData.fullName, 
            formData.certificationDetails || 'Certification details not specified'
          );
          break;
        case 'retailer':
          tx = await contractWithSigner.registerRetailer(
            formData.fullName, 
            formData.businessName || 'Business name not specified'
          );
          break;
        case 'distributor':
          tx = await contractWithSigner.registerDistributor(
            formData.fullName, 
            formData.businessLicense || 'License not specified'
          );
          break;
        default:
          throw new Error('Invalid role selected');
      }
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Blockchain registration successful:', receipt);
      
      toast({
        title: "Blockchain Registration Successful",
        description: `Registered as ${formData.role} on blockchain`,
      });
      
      return true;
    } catch (error: unknown) {
      console.error('Blockchain registration error:', error);
      
      // Handle specific error types
      const err = error as { code?: string; operation?: string; message?: string };
      if (err.code === 'UNSUPPORTED_OPERATION' && err.operation === 'getEnsAddress') {
        toast({
          title: "ENS Error",
          description: "Local blockchain doesn't support ENS. Please use direct contract interaction.",
          variant: "destructive"
        });
      } else if (err.code === 'ACTION_REJECTED') {
        toast({
          title: "Transaction Rejected",
          description: "User rejected the blockchain transaction",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Blockchain Registration Failed",
          description: err.message || "Please try again or contact support",
          variant: "destructive"
        });
      }
      return false;
    } finally {
      setIsBlockchainRegistering(false);
    }
  };

  // Form validation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
      if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
      if (!/^\d{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Aadhar number must be 12 digits';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (step === 2) {
      if (!formData.role) newErrors.role = 'Role selection is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.address?.trim()) newErrors.address = 'Address is required';
      if (!formData.pincode?.trim()) newErrors.pincode = 'Pincode is required';
      if (!/^\d{6}$/.test(formData.pincode || '')) newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    if (step === 3) {
      if (!isBlockchainConnected || !walletAddress) newErrors.wallet = 'Wallet connection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      handleNextStep();
      return;
    }
    
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    
    try {
      // Step 1: Register on blockchain if wallet is connected
      if (isBlockchainConnected && walletAddress && formData.role !== 'consumer') {
        const blockchainSuccess = await handleBlockchainRegistration();
        if (blockchainSuccess) {
          setFormData(prev => ({ ...prev, blockchainRegistered: true }));
        }
      }
      
      // Step 2: Register in database with all form data
      const registrationData = {
        ...formData,
        walletAddress: walletAddress,
        blockchainRegistered: formData.blockchainRegistered || false,
        registrationTimestamp: new Date().toISOString()
      };
      
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: registrationData,
      });

      if (!response) {
        throw new Error('Registration failed - no response');
      }

      toast({
        title: "Registration Successful!",
        description: `Welcome ${formData.fullName}! Your account has been created.`,
      });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'producer':
        return (
          <>
            <div>
              <Label htmlFor="farmLocation">Farm Location *</Label>
              <Input
                id="farmLocation"
                value={formData.farmLocation || ''}
                onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                placeholder="Detailed farm location"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="landSize">Land Size</Label>
              <Input
                id="landSize"
                value={formData.landSize || ''}
                onChange={(e) => handleInputChange('landSize', e.target.value)}
                placeholder="e.g., 5 acres, 2 hectares"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="cropTypes">Crop Types</Label>
              <Input
                id="cropTypes"
                value={formData.cropTypes || ''}
                onChange={(e) => handleInputChange('cropTypes', e.target.value)}
                placeholder="e.g., Rice, Wheat, Vegetables"
                className="mt-2"
              />
            </div>
          </>
        );
        
      case 'quality-inspector':
        return (
          <>
            <div>
              <Label htmlFor="organizationName">Organization Name *</Label>
              <Input
                id="organizationName"
                value={formData.organizationName || ''}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Your organization name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="certificationDetails">Certification Details</Label>
              <Textarea
                id="certificationDetails"
                value={formData.certificationDetails || ''}
                onChange={(e) => handleInputChange('certificationDetails', e.target.value)}
                placeholder="List your certifications and qualifications"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="validationId">Validation ID *</Label>
              <Input
                id="validationId"
                value={formData.validationId || ''}
                onChange={(e) => handleInputChange('validationId', e.target.value)}
                placeholder="Government issued validation ID"
                className="mt-2"
              />
            </div>
          </>
        );
        
      case 'retailer':
      case 'distributor':
        return (
          <>
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Your company/business name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                placeholder="Business license number"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber || ''}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                placeholder="GST registration number"
                className="mt-2"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="card-elevated">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Personal Information' :
                  currentStep === 2 ? 'Role & Location Details' :
                  'Blockchain Integration'
                }
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep ? 'bg-primary text-primary-foreground' :
                      step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center mb-6">Personal Information</h2>
                  
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      value={formData.fullName} 
                      onChange={(e) => handleInputChange('fullName', e.target.value)} 
                      className="mt-2" 
                      placeholder="Enter your full name" 
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input 
                        id="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)} 
                        className="mt-2" 
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                      <Input 
                        id="aadharNumber" 
                        value={formData.aadharNumber} 
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)} 
                        className="mt-2" 
                        placeholder="12-digit Aadhar number"
                        maxLength={12}
                      />
                      {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password} 
                          onChange={(e) => handleInputChange('password', e.target.value)} 
                          className="mt-2 pr-10" 
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword} 
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                          className="mt-2 pr-10" 
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Role & Location */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-center mb-6">Role & Location Details</h2>
                  
                  {/* Role Selection */}
                  <div className="space-y-4">
                    <Label>Select Your Role *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {roles.map((role) => {
                        const isSelected = formData.role === role.value;
                        const Icon = role.icon;
                        
                        return (
                          <div 
                            key={role.value} 
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
                            }`}
                            onClick={() => handleInputChange('role', role.value)}
                          >
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                isSelected ? role.color : 'bg-muted'
                              }`}>
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                              </div>
                              <div>
                                <p className="font-medium">{role.labelKey}</p>
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>
                  
                  {/* Location Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state || ''} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input 
                        id="district" 
                        value={formData.district || ''} 
                        onChange={(e) => handleInputChange('district', e.target.value)} 
                        className="mt-2" 
                        placeholder="Enter district"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea 
                      id="address" 
                      value={formData.address || ''} 
                      onChange={(e) => handleInputChange('address', e.target.value)} 
                      className="mt-2" 
                      placeholder="Enter your complete address"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input 
                      id="pincode" 
                      value={formData.pincode || ''} 
                      onChange={(e) => handleInputChange('pincode', e.target.value)} 
                      className="mt-2" 
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                  
                  {/* Role-specific fields */}
                  {formData.role && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-semibold">
                        {formData.role === 'producer' ? 'Farm Details' :
                         formData.role === 'quality-inspector' ? 'Organization Details' :
                         'Business Details'}
                      </h3>
                      {renderRoleSpecificFields()}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Blockchain Integration */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-center mb-6">Blockchain Integration</h2>
                  
                  {/* Wallet Connection */}
                  <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
                      {isBlockchainConnected && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    
                    {!isBlockchainConnected ? (
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect your MetaMask wallet to enable secure blockchain features for transparent supply chain tracking.
                        </p>
                        <WalletConnection onConnect={handleWalletConnect} />
                        {errors.wallet && <p className="text-red-500 text-sm mt-2">{errors.wallet}</p>}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Wallet Connected Successfully!</span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {formatAddress(walletAddress!)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Registration Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Registration Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium">{roles.find(r => r.value === formData.role)?.labelKey}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{formData.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wallet Status:</span>
                        <span className={`font-medium ${isBlockchainConnected ? 'text-green-600' : 'text-orange-600'}`}>
                          {isBlockchainConnected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="px-6"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 ml-auto"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 ml-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/login')} 
                    className="p-0 h-auto text-primary hover:underline"
                  >
                    Sign In Here
                  </Button>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;