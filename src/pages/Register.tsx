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
    { value: 'farmer', label: 'Farmer', icon: User, color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { value: 'distributor', label: 'Distributor', icon: Building, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { value: 'retailer', label: 'Retailer', icon: Building, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
    { value: 'validator', label: 'Validator', icon: FileText, color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
    { value: 'consumer', label: 'Consumer', icon: Users, color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
  ];

  const labels = {
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    aadharNumber: 'Aadhar Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    otp: 'Enter OTP',
    role: 'I am a',
    farmName: 'Farm Name',
    farmLocation: 'Farm Location',
    landSize: 'Land Size',
    companyName: 'Company Name',
    licenseNumber: 'License Number',
    operatingRegion: 'Operating Region',
    shopName: 'Shop Name',
    shopLocation: 'Shop Location',
    gstNumber: 'GST Number',
    organizationName: 'Organization Name',
    designation: 'Designation',
    validationId: 'Validation ID',
    pinCode: 'Pin Code',
    preferredLanguage: 'Preferred Language',
  };

  const placeholders = {
    fullName: 'Enter your full name',
    phoneNumber: '10-digit mobile number',
    aadharNumber: '12-digit Aadhar number',
    otp: '6-digit OTP',
    password: 'Minimum 6 characters',
    confirmPassword: 'Re-enter password',
    farmName: 'Enter farm name',
    farmLocation: 'Village, District, State',
    landSize: 'Acres or Hectares',
    companyName: 'Enter company name',
    licenseNumber: 'Enter license number',
    operatingRegion: 'Enter operating region',
    shopName: 'Enter shop name',
    shopLocation: 'Pin Code',
    gstNumber: 'Enter GST number',
    organizationName: 'Enter organization name',
    designation: 'Enter designation',
    validationId: 'Government-issued ID',
    pinCode: '6-digit pin code',
    preferredLanguage: 'Select language',
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Invalid Indian phone number';
    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
    if (!/^\d{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!formData.phoneNumber || !/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setErrors((prev) => ({ ...prev, phoneNumber: 'Please enter a valid phone number first' }));
      return;
    }
    setIsLoading(true);
    setTimeout(() => { setOtpSent(true); setIsLoading(false); console.log('OTP sent to:', formData.phoneNumber); }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!otpSent) { await sendOTP(); return; }
    if (!otp || otp.length !== 6) { setErrors((prev) => ({ ...prev, otp: 'Please enter 6-digit OTP' })); return; }
    setIsLoading(true);
    setTimeout(() => { console.log('Registration successful:', formData); setIsLoading(false); navigate(`/dashboard/${formData.role}`); }, 2000);
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'farmer': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label htmlFor="farmName">Farm Name *</Label><Input id="farmName" value={formData.farmName || ''} onChange={(e) => handleInputChange('farmName', e.target.value)} className="mt-2" placeholder="Enter farm name" /></div>
          <div><Label htmlFor="farmLocation">Farm Location *</Label><Input id="farmLocation" value={formData.farmLocation || ''} onChange={(e) => handleInputChange('farmLocation', e.target.value)} className="mt-2" placeholder="Village, District, State" /></div>
          <div><Label htmlFor="landSize">Land Size *</Label><Input id="landSize" value={formData.landSize || ''} onChange={(e) => handleInputChange('landSize', e.target.value)} className="mt-2" placeholder="Acres or Hectares" /></div>
        </div>
      );
      case 'distributor': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label htmlFor="companyName">Company Name *</Label><Input id="companyName" value={formData.companyName || ''} onChange={(e) => handleInputChange('companyName', e.target.value)} className="mt-2" placeholder="Enter company name" /></div>
          <div><Label htmlFor="licenseNumber">License Number *</Label><Input id="licenseNumber" value={formData.licenseNumber || ''} onChange={(e) => handleInputChange('licenseNumber', e.target.value)} className="mt-2" placeholder="Enter license number" /></div>
          <div className="sm:col-span-2"><Label htmlFor="operatingRegion">Operating Region *</Label><Input id="operatingRegion" value={formData.operatingRegion || ''} onChange={(e) => handleInputChange('operatingRegion', e.target.value)} className="mt-2" placeholder="Enter operating region" /></div>
        </div>
      );
      case 'retailer': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label htmlFor="shopName">Shop Name *</Label><Input id="shopName" value={formData.shopName || ''} onChange={(e) => handleInputChange('shopName', e.target.value)} className="mt-2" placeholder="Enter shop name" /></div>
          <div><Label htmlFor="shopLocation">Shop Location *</Label><Input id="shopLocation" value={formData.shopLocation || ''} onChange={(e) => handleInputChange('shopLocation', e.target.value)} className="mt-2" placeholder="Pin Code" /></div>
          <div className="sm:col-span-2"><Label htmlFor="gstNumber">GST Number *</Label><Input id="gstNumber" value={formData.gstNumber || ''} onChange={(e) => handleInputChange('gstNumber', e.target.value)} className="mt-2" placeholder="Enter GST number" /></div>
        </div>
      );
      case 'validator': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label htmlFor="organizationName">Organization Name *</Label><Input id="organizationName" value={formData.organizationName || ''} onChange={(e) => handleInputChange('organizationName', e.target.value)} className="mt-2" placeholder="Enter organization name" /></div>
          <div><Label htmlFor="designation">Designation *</Label><Input id="designation" value={formData.designation || ''} onChange={(e) => handleInputChange('designation', e.target.value)} className="mt-2" placeholder="Enter designation" /></div>
          <div className="sm:col-span-2"><Label htmlFor="validationId">Validation ID *</Label><Input id="validationId" value={formData.validationId || ''} onChange={(e) => handleInputChange('validationId', e.target.value)} className="mt-2" placeholder="Government-issued ID" /></div>
        </div>
      );
      case 'consumer': return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label htmlFor="pinCode">Pin Code *</Label><Input id="pinCode" value={formData.pinCode || ''} onChange={(e) => handleInputChange('pinCode', e.target.value)} className="mt-2" placeholder="6-digit pin code" /></div>
          <div><Label htmlFor="preferredLanguage">Preferred Language *</Label><Select value={formData.preferredLanguage || ''} onValueChange={(value) => handleInputChange('preferredLanguage', value)}><SelectTrigger className="mt-2"><SelectValue placeholder="Select language" /></SelectTrigger><SelectContent><SelectItem value="english">English</SelectItem><SelectItem value="telugu">Telugu</SelectItem><SelectItem value="hindi">Hindi</SelectItem></SelectContent></Select></div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2"><ArrowLeft className="w-4 h-4" />Back to Home</Button>
          <LanguageSelector />
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <Card className="card-elevated">
          <div className="p-4 sm:p-8">
            <div className="text-center mb-6"><h1 className="text-2xl sm:text-3xl font-bold">Create Account</h1></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-center">Select Your Role</h2>
                <p className="text-sm text-muted-foreground text-center">I am a *</p>
                <div className="flex flex-wrap justify-center gap-4 overflow-visible z-50">
                  {roles.map((role) => {
                    const isSelected = formData.role === role.value;
                    const Icon = role.icon;
                    return (
                      <div key={role.value} className="flex flex-col items-center cursor-pointer" onClick={() => handleInputChange('role', role.value)}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? role.color : 'bg-gray-200'} ${isSelected ? 'shadow-lg scale-110' : role.hoverColor}`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="mt-2 text-center">
                          <div className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-foreground'} whitespace-normal break-words`}>{role.label}</div>
                        </div>
                        {isSelected && <div className={`w-2 h-2 rounded-full mt-1 ${role.color}`}></div>}
                      </div>
                    );
                  })}
                </div>
                {errors.role && <p className="text-red-500 text-sm text-center">{errors.role}</p>}
              </div>
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="fullName">Full Name *</Label><Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="mt-2" placeholder="Enter your full name" /></div>
                  <div><Label htmlFor="phoneNumber">Phone Number *</Label><div className="flex flex-col sm:flex-row gap-2 mt-2"><Input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} maxLength={10} placeholder="10-digit mobile number" />{!otpSent && <Button type="button" onClick={sendOTP} disabled={isLoading} variant="outline">Send OTP</Button>}</div></div>
                  <div><Label htmlFor="aadharNumber">Aadhar Number *</Label><Input id="aadharNumber" value={formData.aadharNumber} onChange={(e) => handleInputChange('aadharNumber', e.target.value)} className="mt-2" placeholder="12-digit Aadhar number" maxLength={12} /></div>
                  {otpSent && <div><Label htmlFor="otp">Enter OTP *</Label><Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-2" placeholder="6-digit OTP" maxLength={6} /></div>}
                  <div><Label htmlFor="password">Password *</Label><div className="relative mt-2"><Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="pr-12" placeholder="Minimum 6 characters" /><Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button></div></div>
                  <div><Label htmlFor="confirmPassword">Confirm Password *</Label><div className="relative mt-2"><Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="pr-12" placeholder="Re-enter password" /><Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button></div></div>
                </div>
              </div>
              {formData.role && <div className="space-y-4"><h2 className="text-lg sm:text-xl font-semibold border-b pb-2">Additional Information</h2>{renderRoleSpecificFields()}</div>}
              <Button type="submit" className="w-full btn-primary" size="lg" disabled={isLoading}>{isLoading ? 'Creating Account...' : otpSent ? 'Create Account' : 'Send OTP & Continue'}</Button>
              <div className="text-center mt-6"><p className="text-muted-foreground">Already have an account? <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto text-primary">Login here</Button></p></div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;