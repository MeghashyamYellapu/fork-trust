import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Lock, Eye, EyeOff, MapPin, Building, FileText, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

type UserRole = 'farmer' | 'distributor' | 'retailer' | 'validator' | 'consumer';

interface FormData {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  // Role-specific fields
  farmName?: string;
  farmLocation?: string;
  landSize?: string;
  cropTypes?: string[];
  companyName?: string;
  licenseNumber?: string;
  operatingRegion?: string;
  shopName?: string;
  shopLocation?: string;
  gstNumber?: string;
  organizationName?: string;
  designation?: string;
  validationId?: string;
  pinCode?: string;
  preferredLanguage?: string;
}

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: 'farmer', label: 'Farmer / రైతు / किसान', icon: User },
    { value: 'distributor', label: 'Distributor / పంపిణీదారు / वितरक', icon: Building },
    { value: 'retailer', label: 'Retailer / రిటైలర్ / खुदरा विक्रेता', icon: Building },
    { value: 'validator', label: 'Validator / వేలిడేటర్ / सत्यापनकर्ता', icon: FileText },
    { value: 'consumer', label: 'Consumer / వినియోగదారు / उपभोक्ता', icon: Users },
  ];

  const cropTypes = [
    'Rice / వరి / चावल',
    'Wheat / గోధుమ / गेहूं',
    'Cotton / పత్తి / कपास',
    'Sugarcane / చెరకు / गन्ना',
    'Vegetables / కూరగాయలు / सब्जियां',
    'Fruits / పండ్లు / फल',
    'Pulses / పప్పులు / दालें',
    'Spices / మసాలా / मसाले',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCropTypeChange = (cropType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cropTypes: checked 
        ? [...(prev.cropTypes || []), cropType]
        : (prev.cropTypes || []).filter(type => type !== cropType)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid Indian phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';

    // Role-specific validation
    if (formData.role === 'farmer') {
      if (!formData.farmName) newErrors.farmName = 'Farm name is required';
      if (!formData.farmLocation) newErrors.farmLocation = 'Farm location is required';
      if (!formData.landSize) newErrors.landSize = 'Land size is required';
    }

    if (formData.role === 'distributor') {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
      if (!formData.operatingRegion) newErrors.operatingRegion = 'Operating region is required';
    }

    if (formData.role === 'retailer') {
      if (!formData.shopName) newErrors.shopName = 'Shop name is required';
      if (!formData.shopLocation) newErrors.shopLocation = 'Shop location is required';
      if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
    }

    if (formData.role === 'validator') {
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      if (!formData.designation) newErrors.designation = 'Designation is required';
      if (!formData.validationId) newErrors.validationId = 'Validation ID is required';
    }

    if (formData.role === 'consumer') {
      if (!formData.pinCode) newErrors.pinCode = 'Pin code is required';
      if (!formData.preferredLanguage) newErrors.preferredLanguage = 'Preferred language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!formData.phoneNumber || !/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid phone number first' }));
      return;
    }

    setIsLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      // In real implementation, this would trigger SMS
      console.log('OTP sent to:', formData.phoneNumber);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!otpSent) {
      await sendOTP();
      return;
    }

    if (!otp || otp.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'Please enter 6-digit OTP' }));
      return;
    }

    setIsLoading(true);
    
    // Mock registration
    setTimeout(() => {
      console.log('Registration successful:', formData);
      setIsLoading(false);
      // Navigate to appropriate dashboard based on role
      navigate(`/dashboard/${formData.role}`);
    }, 2000);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="farmName" className="text-large">Farm Name / వ్యవసాయ క్షేత్రం పేరు / खेत का नाम</Label>
              <Input
                id="farmName"
                value={formData.farmName || ''}
                onChange={(e) => handleInputChange('farmName', e.target.value)}
                className="mt-2 text-lg"
                placeholder="Enter farm name"
              />
              {errors.farmName && <p className="text-error text-sm mt-1">{errors.farmName}</p>}
            </div>
            
            <div>
              <Label htmlFor="farmLocation" className="text-large">Farm Location / వ్యవసాయ క్షేత్రం స్థానం / खेत का स्थान</Label>
              <Input
                id="farmLocation"
                value={formData.farmLocation || ''}
                onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                className="mt-2 text-lg"
                placeholder="Village, District, State"
              />
              {errors.farmLocation && <p className="text-error text-sm mt-1">{errors.farmLocation}</p>}
            </div>
            
            <div>
              <Label htmlFor="landSize" className="text-large">Land Size / భూమి పరిమాణం / भूमि का आकार</Label>
              <Input
                id="landSize"
                value={formData.landSize || ''}
                onChange={(e) => handleInputChange('landSize', e.target.value)}
                className="mt-2 text-lg"
                placeholder="Acres or Hectares"
              />
              {errors.landSize && <p className="text-error text-sm mt-1">{errors.landSize}</p>}
            </div>
            
            <div>
              <Label className="text-large">Type of Crops / పంట రకాలు / फसल के प्रकार</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {cropTypes.map((crop) => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={(formData.cropTypes || []).includes(crop)}
                      onCheckedChange={(checked) => handleCropTypeChange(crop, !!checked)}
                    />
                    <Label htmlFor={crop} className="text-sm">{crop}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'distributor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="text-large">Company Name / కంపెనీ పేరు / कंपनी का नाम</Label>
              <Input
                id="companyName"
                value={formData.companyName || ''}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.companyName && <p className="text-error text-sm mt-1">{errors.companyName}</p>}
            </div>
            
            <div>
              <Label htmlFor="licenseNumber" className="text-large">License Number / లైసెన్స్ నంబర్ / लाइसेंस नंबर</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.licenseNumber && <p className="text-error text-sm mt-1">{errors.licenseNumber}</p>}
            </div>
            
            <div>
              <Label htmlFor="operatingRegion" className="text-large">Operating Region / వ్యాపార ప్రాంతం / संचालन क्षेत्र</Label>
              <Input
                id="operatingRegion"
                value={formData.operatingRegion || ''}
                onChange={(e) => handleInputChange('operatingRegion', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.operatingRegion && <p className="text-error text-sm mt-1">{errors.operatingRegion}</p>}
            </div>
          </div>
        );

      case 'retailer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="shopName" className="text-large">Shop Name / దుకాణం పేరు / दुकान का नाम</Label>
              <Input
                id="shopName"
                value={formData.shopName || ''}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.shopName && <p className="text-error text-sm mt-1">{errors.shopName}</p>}
            </div>
            
            <div>
              <Label htmlFor="shopLocation" className="text-large">Shop Location / దుకాణం స్థానం / दुकान का स्थान</Label>
              <Input
                id="shopLocation"
                value={formData.shopLocation || ''}
                onChange={(e) => handleInputChange('shopLocation', e.target.value)}
                className="mt-2 text-lg"
                placeholder="Pin Code"
              />
              {errors.shopLocation && <p className="text-error text-sm mt-1">{errors.shopLocation}</p>}
            </div>
            
            <div>
              <Label htmlFor="gstNumber" className="text-large">GST Number / GST నంబర్ / GST नंबर</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber || ''}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.gstNumber && <p className="text-error text-sm mt-1">{errors.gstNumber}</p>}
            </div>
          </div>
        );

      case 'validator':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="organizationName" className="text-large">Organization Name / సంస్థ పేరు / संगठन का नाम</Label>
              <Input
                id="organizationName"
                value={formData.organizationName || ''}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.organizationName && <p className="text-error text-sm mt-1">{errors.organizationName}</p>}
            </div>
            
            <div>
              <Label htmlFor="designation" className="text-large">Designation / హోదా / पदनाम</Label>
              <Input
                id="designation"
                value={formData.designation || ''}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="mt-2 text-lg"
              />
              {errors.designation && <p className="text-error text-sm mt-1">{errors.designation}</p>}
            </div>
            
            <div>
              <Label htmlFor="validationId" className="text-large">Validation ID / ధృవీకరణ ID / सत्यापन ID</Label>
              <Input
                id="validationId"
                value={formData.validationId || ''}
                onChange={(e) => handleInputChange('validationId', e.target.value)}
                className="mt-2 text-lg"
                placeholder="Government-issued ID"
              />
              {errors.validationId && <p className="text-error text-sm mt-1">{errors.validationId}</p>}
            </div>
          </div>
        );

      case 'consumer':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pinCode" className="text-large">Pin Code / పిన్ కోడ్ / पिन कोड</Label>
              <Input
                id="pinCode"
                value={formData.pinCode || ''}
                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                className="mt-2 text-lg"
                placeholder="6-digit pin code"
              />
              {errors.pinCode && <p className="text-error text-sm mt-1">{errors.pinCode}</p>}
            </div>
            
            <div>
              <Label htmlFor="preferredLanguage" className="text-large">Preferred Language / ప్రాధాన్య భాష / पसंदीदा भाषा</Label>
              <Select value={formData.preferredLanguage || ''} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                <SelectTrigger className="mt-2 text-lg">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="telugu">తెలుగు</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredLanguage && <p className="text-error text-sm mt-1">{errors.preferredLanguage}</p>}
            </div>
          </div>
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
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="card-elevated">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join the transparent farming revolution</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">Basic Information</h2>
                
                <div>
                  <Label htmlFor="fullName" className="text-large">Full Name / పూర్తి పేరు / पूरा नाम *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="mt-2 text-lg"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-error text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-large">Phone Number / ఫోన్ నంబర్ / फोन नंबर *</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="text-lg"
                      placeholder="10-digit mobile number"
                      maxLength={10}
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
                  {errors.phoneNumber && <p className="text-error text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                {otpSent && (
                  <div>
                    <Label htmlFor="otp" className="text-large">Enter OTP / OTP నమోదు చేయండి / OTP दर्ज करें *</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mt-2 text-lg"
                      placeholder="6-digit OTP"
                      maxLength={6}
                    />
                    {errors.otp && <p className="text-error text-sm mt-1">{errors.otp}</p>}
                  </div>
                )}

                <div>
                  <Label htmlFor="password" className="text-large">Password / పాస్‌వర్డ్ / पासवर्ड *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="text-lg pr-12"
                      placeholder="Minimum 6 characters"
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

                <div>
                  <Label htmlFor="confirmPassword" className="text-large">Confirm Password / పాస్‌వర్డ్ నిర్ధారించండి / पासवर्ड की पुष्टि करें *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="text-lg pr-12"
                      placeholder="Re-enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">Select Your Role</h2>
                
                <div>
                  <Label className="text-large">I am a / నేను / मैं हूँ *</Label>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {roles.map((role) => (
                      <div
                        key={role.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.role === role.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('role', role.value)}
                      >
                        <div className="flex items-center gap-3">
                          <role.icon className="w-6 h-6 text-primary" />
                          <span className="text-lg font-medium">{role.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.role && <p className="text-error text-sm mt-1">{errors.role}</p>}
                </div>
              </div>

              {/* Role-specific fields */}
              {formData.role && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground border-b pb-2">Additional Information</h2>
                  {renderRoleSpecificFields()}
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-primary"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : otpSent ? 'Create Account' : 'Send OTP & Continue'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/login')}
                  className="p-0 h-auto text-primary"
                >
                  Login here
                </Button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;