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

type UserRole = 'farmer' | 'distributor' | 'retailer' | 'validator' | 'consumer';

interface FormData {
  fullName: string;
  phoneNumber: string;
  aadharNumber: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  farmName?: string;
  farmLocation?: string;
  landSize?: string;
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
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    aadharNumber: '',
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
    { 
      value: 'farmer', 
      labelKey: 'farmer', 
      icon: User, 
      color: 'bg-green-500', 
      hoverColor: 'hover:bg-green-600' 
    },
    { 
      value: 'distributor', 
      labelKey: 'distributor', 
      icon: Building, 
      color: 'bg-blue-500', 
      hoverColor: 'hover:bg-blue-600' 
    },
    { 
      value: 'retailer', 
      labelKey: 'retailer', 
      icon: Building, 
      color: 'bg-purple-500', 
      hoverColor: 'hover:bg-purple-600' 
    },
    { 
      value: 'validator', 
      labelKey: 'validator', 
      icon: FileText, 
      color: 'bg-orange-500', 
      hoverColor: 'hover:bg-orange-600' 
    },
    { 
      value: 'consumer', 
      labelKey: 'consumer', 
      icon: Users, 
      color: 'bg-pink-500', 
      hoverColor: 'hover:bg-pink-600' 
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    // Basic information validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid Indian phone number';
    }
    
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!formData.phoneNumber || !/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setErrors((prev) => ({ 
        ...prev, 
        phoneNumber: 'Please enter a valid phone number first' 
      }));
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP sending delay
    setTimeout(() => { 
      setOtpSent(true); 
      setIsLoading(false); 
      console.log('OTP sent to:', formData.phoneNumber); 
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If OTP not sent yet, send it first
    if (!otpSent) { 
      await sendOTP(); 
      return; 
    }
    
    // Validate OTP
    if (!otp || otp.length !== 6) { 
      setErrors((prev) => ({ 
        ...prev, 
        otp: 'Please enter 6-digit OTP' 
      })); 
      return; 
    }
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => { 
      console.log('Registration successful:', formData); 
      setIsLoading(false); 
      navigate(`/dashboard/${formData.role}`); 
    }, 2000);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'farmer': 
        return (
          <>
            <div>
              <Label htmlFor="farmName">{t('farmName')} *</Label>
              <Input 
                id="farmName" 
                value={formData.farmName || ''} 
                onChange={(e) => handleInputChange('farmName', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterFarmName')} 
              />
            </div>
            <div>
              <Label htmlFor="farmLocation">{t('farmLocation')} *</Label>
              <Input 
                id="farmLocation" 
                value={formData.farmLocation || ''} 
                onChange={(e) => handleInputChange('farmLocation', e.target.value)} 
                className="mt-2" 
                placeholder={t('villageDistrictState')} 
              />
            </div>
            <div>
              <Label htmlFor="landSize">{t('landSize')} *</Label>
              <Input 
                id="landSize" 
                value={formData.landSize || ''} 
                onChange={(e) => handleInputChange('landSize', e.target.value)} 
                className="mt-2" 
                placeholder={t('acresHectares')} 
              />
            </div>
          </>
        );
      case 'distributor': 
        return (
          <>
            <div>
              <Label htmlFor="companyName">{t('companyName')} *</Label>
              <Input 
                id="companyName" 
                value={formData.companyName || ''} 
                onChange={(e) => handleInputChange('companyName', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterCompanyName')} 
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">{t('licenseNumber')} *</Label>
              <Input 
                id="licenseNumber" 
                value={formData.licenseNumber || ''} 
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterLicenseNumber')} 
              />
            </div>
            <div>
              <Label htmlFor="operatingRegion">{t('operatingRegion')} *</Label>
              <Input 
                id="operatingRegion" 
                value={formData.operatingRegion || ''} 
                onChange={(e) => handleInputChange('operatingRegion', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterOperatingRegion')} 
              />
            </div>
          </>
        );
      case 'retailer': 
        return (
          <>
            <div>
              <Label htmlFor="shopName">{t('shopName')} *</Label>
              <Input 
                id="shopName" 
                value={formData.shopName || ''} 
                onChange={(e) => handleInputChange('shopName', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterShopName')} 
              />
            </div>
            <div>
              <Label htmlFor="shopLocation">{t('shopLocation')} *</Label>
              <Input 
                id="shopLocation" 
                value={formData.shopLocation || ''} 
                onChange={(e) => handleInputChange('shopLocation', e.target.value)} 
                className="mt-2" 
                placeholder={t('pinCode')} 
              />
            </div>
            <div>
              <Label htmlFor="gstNumber">{t('gstNumber')} *</Label>
              <Input 
                id="gstNumber" 
                value={formData.gstNumber || ''} 
                onChange={(e) => handleInputChange('gstNumber', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterGstNumber')} 
              />
            </div>
          </>
        );
      case 'validator': 
        return (
          <>
            <div>
              <Label htmlFor="organizationName">{t('organizationName')} *</Label>
              <Input 
                id="organizationName" 
                value={formData.organizationName || ''} 
                onChange={(e) => handleInputChange('organizationName', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterOrganizationName')} 
              />
            </div>
            <div>
              <Label htmlFor="designation">{t('designation')} *</Label>
              <Input 
                id="designation" 
                value={formData.designation || ''} 
                onChange={(e) => handleInputChange('designation', e.target.value)} 
                className="mt-2" 
                placeholder={t('enterDesignation')} 
              />
            </div>
            <div>
              <Label htmlFor="validationId">{t('validationId')} *</Label>
              <Input 
                id="validationId" 
                value={formData.validationId || ''} 
                onChange={(e) => handleInputChange('validationId', e.target.value)} 
                className="mt-2" 
                placeholder={t('governmentIssuedId')} 
              />
            </div>
          </>
        );
      case 'consumer': 
        return (
          <>
            <div>
              <Label htmlFor="pinCode">{t('pinCode')} *</Label>
              <Input 
                id="pinCode" 
                value={formData.pinCode || ''} 
                onChange={(e) => handleInputChange('pinCode', e.target.value)} 
                className="mt-2" 
                placeholder={t('sixDigitPinCode')} 
              />
            </div>
            <div>
              <Label htmlFor="preferredLanguage">{t('preferredLanguage')} *</Label>
              <Select 
                value={formData.preferredLanguage || ''} 
                onValueChange={(value) => handleInputChange('preferredLanguage', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">{t('english')}</SelectItem>
                  <SelectItem value="telugu">{t('telugu')}</SelectItem>
                  <SelectItem value="hindi">{t('hindi')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <LanguageSelector />
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-1 max-w-6xl flex-grow">
        <Card className="card-elevated">
          <div className="px-4 py-2 sm:p-0">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-3xl font-bold">{t('createAccount')}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-center">{t('selectYourRole')}</h2>
                  <div className="flex flex-wrap justify-center gap-4 overflow-visible z-50">
                    {roles.map((role) => {
                      const isSelected = formData.role === role.value;
                      const Icon = role.icon;
                      
                      return (
                        <div 
                          key={role.value} 
                          className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105" 
                          onClick={() => handleInputChange('role', role.value)}
                        >
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                            ${isSelected ? role.color : 'bg-gray-200'}
                            ${isSelected ? 'shadow-lg scale-110' : role.hoverColor}
                          `}>
                            <Icon className={`w-6 h-6 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="mt-2 text-center">
                            <div className={`
                              text-lg font-medium whitespace-normal break-words
                              ${isSelected ? 'text-primary' : 'text-foreground'}
                            `}>
                              {t(role.labelKey)}
                            </div>
                          </div>
                          {isSelected && (
                            <div className={`w-2 h-2 rounded-full mt-1 ${role.color}`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {errors.role && <p className="text-red-500 text-sm text-center">{errors.role}</p>}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Constant Fields */}
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 text-primary">
                    {t('basicInformation')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">{t('fullName')} *</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={(e) => handleInputChange('fullName', e.target.value)} 
                        className="mt-2" 
                        placeholder={t('enterFullName')} 
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneNumber">{t('phoneNumber')} *</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        <Input 
                          id="phoneNumber" 
                          value={formData.phoneNumber} 
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)} 
                          maxLength={10} 
                          placeholder={t('mobile10Digit')}
                          className="transition-colors duration-200 focus:ring-2"
                        />
                        {!otpSent && (
                          <Button 
                            type="button" 
                            onClick={sendOTP} 
                            disabled={isLoading || !formData.phoneNumber} 
                            variant="outline"
                            className="w-full transition-all duration-200"
                          >
                            {isLoading ? t('sending') : t('sendOTP')}
                          </Button>
                        )}
                      </div>
                      {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="aadharNumber">{t('aadharNumberLabel')} *</Label>
                      <Input 
                        id="aadharNumber" 
                        value={formData.aadharNumber} 
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)} 
                        className="mt-2" 
                        placeholder={t('aadhar12Digit')} 
                        maxLength={12} 
                      />
                      {errors.aadharNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>}
                    </div>
                    
                    {otpSent && (
                      <div>
                        <Label htmlFor="otp">{t('enterOTP')} *</Label>
                        <Input 
                          id="otp" 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value)} 
                          className="mt-2" 
                          placeholder="6-digit OTP" 
                          maxLength={6} 
                        />
                        {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="password">{t('password')} *</Label>
                      <div className="relative mt-2">
                        <Input 
                          id="password" 
                          type={showPassword ? 'text' : 'password'} 
                          value={formData.password} 
                          onChange={(e) => handleInputChange('password', e.target.value)} 
                          className="pr-12" 
                          placeholder={t('min6Chars')} 
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
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
                      <div className="relative mt-2">
                        <Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? 'text' : 'password'} 
                          value={formData.confirmPassword} 
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                          className="pr-12" 
                          placeholder={t('reenterPassword')} 
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
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Right Column - Role-Specific Fields */}
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 text-primary">
                    {formData.role ? t('additionalInformation') : t('selectRoleFirst')}
                  </h2>
                  {formData.role ? (
                    <div className="space-y-4">
                      {renderRoleSpecificFields()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-center">
                      <div className="text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{t('pleaseSelectRole')}</p>
                        <p className="text-sm">{t('additionalFieldsWillAppear')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button - Full Width */}
              <div className="lg:col-span-2 mt-8">
                <Button 
                  type="submit" 
                  className="w-full btn-primary transition-all duration-200 hover:scale-[1.02]" 
                  size="lg" 
                  disabled={isLoading || !formData.role}
                >
                  {isLoading ? t('creatingAccountLoading') : otpSent ? t('createAccountBtn') : t('sendOtpAndContinue')}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-muted-foreground text-sm">
                    {t('alreadyHaveAccount')}{' '}
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/login')} 
                      className="p-0 h-auto text-primary hover:underline transition-all duration-200"
                    >
                      {t('loginHere')}
                    </Button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
