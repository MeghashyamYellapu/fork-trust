import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpSms, sendForgotPasswordOtpSms, verifyOtpCode } from '../services/twilioService.js';

type Request = express.Request;
type Response = express.Response;

export async function register(req: Request, res: Response) {
  const { 
    fullName, 
    phoneNumber, 
    aadharNumber, 
    password, 
    role, 
    
    // Location fields
    state,
    district,
    address,
    pincode,
    
    // Role-specific fields
    farmName,
    farmLocation,
    landSize,
    cropTypes,
    companyName,
    businessName,
    licenseNumber,
    operatingRegion,
    businessLicense,
    shopName,
    shopLocation,
    gstNumber,
    organizationName,
    designation,
    validationId,
    certificationDetails,
    experience,
    pinCode,
    preferredLanguage,
    
    // Blockchain fields
    walletAddress,
    blockchainRegistered,
    registrationTimestamp,
    
    // Legacy fields for backward compatibility
    phoneOrEmail,
    name
  } = req.body;
  
  // Use new field names or fall back to legacy ones
  const actualFullName = fullName || name;
  const actualPhoneNumber = phoneNumber || phoneOrEmail;
  
  if (!actualFullName || !actualPhoneNumber || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields: fullName, phoneNumber, password, and role are required' });
  }

  if (!aadharNumber && role !== 'consumer') {
    return res.status(400).json({ message: 'Aadhar number is required for all roles except consumer' });
  }
  
  // Check if user already exists by phone number, Aadhar, or wallet address
  const existingByPhone = await User.findOne({ phoneNumber: actualPhoneNumber });
  if (existingByPhone) {
    return res.status(409).json({ message: 'User with this phone number already exists' });
  }
  
  if (aadharNumber) {
    const existingByAadhar = await User.findOne({ aadharNumber });
    if (existingByAadhar) {
      return res.status(409).json({ message: 'User with this Aadhar number already exists' });
    }
  }
  
  if (walletAddress) {
    const existingByWallet = await User.findOne({ walletAddress });
    if (existingByWallet) {
      return res.status(409).json({ message: 'User with this wallet address already exists' });
    }
  }
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Prepare user data with all fields
    const userData: any = {
      fullName: actualFullName,
      phoneNumber: actualPhoneNumber,
      aadharNumber: aadharNumber || '',
      passwordHash,
      role,
      
      // Location fields
      state,
      district, 
      address,
      pincode: pincode || pinCode, // Handle both field names
      
      // Blockchain fields
      walletAddress,
      blockchainRegistered: blockchainRegistered || false,
      registrationTimestamp,
      
      // Legacy fields for backward compatibility
      phoneOrEmail: actualPhoneNumber,
      name: actualFullName
    };
    
    // Add role-specific fields based on role
    switch (role) {
      case 'producer':
        if (farmName) userData.farmName = farmName;
        if (farmLocation) userData.farmLocation = farmLocation;
        if (landSize) userData.landSize = landSize;
        if (cropTypes) userData.cropTypes = cropTypes;
        break;
        
      case 'distributor':
        if (companyName) userData.companyName = companyName;
        if (businessName) userData.businessName = businessName;
        if (licenseNumber) userData.licenseNumber = licenseNumber;
        if (operatingRegion) userData.operatingRegion = operatingRegion;
        if (businessLicense) userData.businessLicense = businessLicense;
        break;
        
      case 'retailer':
        if (businessName) userData.businessName = businessName;
        if (shopName) userData.shopName = shopName;
        if (shopLocation) userData.shopLocation = shopLocation;
        if (gstNumber) userData.gstNumber = gstNumber;
        break;
        
      case 'quality-inspector':
        if (organizationName) userData.organizationName = organizationName;
        if (designation) userData.designation = designation;
        if (validationId) userData.validationId = validationId;
        if (certificationDetails) userData.certificationDetails = certificationDetails;
        if (experience) userData.experience = experience;
        break;
        
      case 'consumer':
        if (pinCode) userData.pinCode = pinCode;
        if (preferredLanguage) userData.preferredLanguage = preferredLanguage;
        break;
    }
    
    const user = await User.create(userData);
    
    // Generate token for immediate login
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    
    return res.status(201).json({ 
      id: user.id, 
      fullName: user.fullName,
      phoneNumber: user.phoneNumber, 
      role: user.role, 
      walletAddress: user.walletAddress,
      blockchainRegistered: user.blockchainRegistered,
      token,
      message: 'Registration successful',
      // Legacy fields
      phoneOrEmail: user.phoneNumber,
      name: user.fullName
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      if (error.message.includes('phoneNumber')) {
        return res.status(409).json({ message: 'User with this phone number already exists' });
      } else if (error.message.includes('aadharNumber')) {
        return res.status(409).json({ message: 'User with this Aadhar number already exists' });
      } else if (error.message.includes('walletAddress')) {
        return res.status(409).json({ message: 'User with this wallet address already exists' });
      } else {
        return res.status(409).json({ message: 'User already exists' });
      }
    }
    
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { phoneOrEmail, password } = req.body;
    
    if (!phoneOrEmail || !password) {
      return res.status(400).json({ message: 'Phone number/email and password are required' });
    }
    
    // Support both new and legacy field names
    let user = await User.findOne({ phoneNumber: phoneOrEmail });
    if (!user) {
      // Fallback to legacy field for backward compatibility
      user = await User.findOne({ phoneOrEmail });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token with userId and role
    const jwtSecret = process.env.JWT_SECRET || 'devsecret_fallback_key';
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );

    console.log(`✅ Login successful for ${user.fullName} (${user.role})`);
    
    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        walletAddress: user.walletAddress,
        blockchainRegistered: user.blockchainRegistered
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}

// In-memory OTP storage (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function sendOtp(req: Request, res: Response) {
  const { phoneOrEmail } = req.body;
  
  if (!phoneOrEmail) {
    return res.status(400).json({ message: 'Phone number or email is required' });
  }
  
  try {
    // Check if it's a phone number (Indian format)
    const isPhoneNumber = /^[6-9]\d{9}$/.test(phoneOrEmail);
    
    if (isPhoneNumber) {
      // Send OTP via SMS using Twilio Verify (no need to generate OTP manually)
      const smsSent = await sendOtpSms(phoneOrEmail);
      
      if (smsSent) {
        console.log(`✅ OTP sent via Twilio Verify to ${phoneOrEmail}`);
        res.json({ success: true, message: 'OTP sent to your phone number' });
      } else {
        console.log(`⚠️ Twilio Verify failed for ${phoneOrEmail}`);
        res.json({ success: false, message: 'Failed to send OTP. Please try again.' });
      }
    } else {
      // For email or non-phone formats, generate manual OTP and log to console
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      // Store OTP in memory for email/non-phone verification
      otpStore.set(phoneOrEmail, { otp, expires });
      
      console.log(`📱 OTP for ${phoneOrEmail}: ${otp} (expires in 5 minutes)`);
      res.json({ success: true, message: 'OTP sent (check server console)' });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  const { phoneOrEmail, otp } = req.body;
  
  if (!phoneOrEmail || !otp) {
    return res.status(400).json({ message: 'Phone number/email and OTP are required' });
  }
  
  try {
    // Check if it's a phone number (Indian format)
    const isPhoneNumber = /^[6-9]\d{9}$/.test(phoneOrEmail);
    
    if (isPhoneNumber) {
      // Use Twilio Verify to verify OTP for phone numbers
      const isVerified = await verifyOtpCode(phoneOrEmail, otp);
      
      if (isVerified) {
        res.json({ success: true, message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
      }
    } else {
      // For email or non-phone formats, use manual OTP verification
      const stored = otpStore.get(phoneOrEmail);
      
      if (!stored) {
        return res.status(400).json({ message: 'OTP not found or expired' });
      }
      
      if (Date.now() > stored.expires) {
        otpStore.delete(phoneOrEmail);
        return res.status(400).json({ message: 'OTP expired' });
      }
      
      if (stored.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
      
      // OTP is valid, remove it from store
      otpStore.delete(phoneOrEmail);
      
      res.json({ success: true, message: 'OTP verified successfully' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

// Forgot password OTP - send OTP for password reset
export async function sendForgotPasswordOtp(req: Request, res: Response) {
  const { phoneOrEmail } = req.body;
  
  if (!phoneOrEmail) {
    return res.status(400).json({ message: 'Phone number or email is required' });
  }
  
  try {
    // Check if user exists
    const user = await User.findOne({ phoneOrEmail });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ success: true, message: 'If the account exists, an OTP will be sent' });
    }
    
    // Check if it's a phone number (Indian format)
    const isPhoneNumber = /^[6-9]\d{9}$/.test(phoneOrEmail);
    
    if (isPhoneNumber) {
      // Send forgot password OTP via SMS using Twilio Verify
      const smsSent = await sendForgotPasswordOtpSms(phoneOrEmail);
      
      if (smsSent) {
        console.log(`✅ Forgot password OTP sent via Twilio Verify to ${phoneOrEmail}`);
      } else {
        console.log(`⚠️ Twilio Verify failed for forgot password OTP to ${phoneOrEmail}`);
        // Generate manual OTP as fallback
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
        const forgotPasswordKey = `forgot_${phoneOrEmail}`;
        otpStore.set(forgotPasswordKey, { otp, expires });
        console.log(`📱 Fallback forgot password OTP for ${phoneOrEmail}: ${otp}`);
      }
    } else {
      // For email or non-phone formats, generate manual OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
      const forgotPasswordKey = `forgot_${phoneOrEmail}`;
      otpStore.set(forgotPasswordKey, { otp, expires });
      console.log(`📱 Forgot password OTP for ${phoneOrEmail}: ${otp} (expires in 10 minutes)`);
    }
    
    res.json({ success: true, message: 'If the account exists, a password reset code has been sent' });
  } catch (error) {
    console.error('Error sending forgot password OTP:', error);
    res.status(500).json({ message: 'Failed to send password reset code' });
  }
}

// Reset password with OTP verification
export async function resetPassword(req: Request, res: Response) {
  const { phoneOrEmail, otp, newPassword } = req.body;
  
  if (!phoneOrEmail || !otp || !newPassword) {
    return res.status(400).json({ message: 'Phone number/email, OTP, and new password are required' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  try {
    // Check if it's a phone number (Indian format)
    const isPhoneNumber = /^[6-9]\d{9}$/.test(phoneOrEmail);
    
    if (isPhoneNumber) {
      // Use Twilio Verify to verify OTP for phone numbers
      const isVerified = await verifyOtpCode(phoneOrEmail, otp);
      
      if (!isVerified) {
        return res.status(400).json({ message: 'Invalid or expired reset code' });
      }
    } else {
      // For email or non-phone formats, use manual OTP verification
      const forgotPasswordKey = `forgot_${phoneOrEmail}`;
      const stored = otpStore.get(forgotPasswordKey);
      
      if (!stored) {
        return res.status(400).json({ message: 'Invalid or expired reset code' });
      }
      
      if (Date.now() > stored.expires) {
        otpStore.delete(forgotPasswordKey);
        return res.status(400).json({ message: 'Reset code expired' });
      }
      
      if (stored.otp !== otp) {
        return res.status(400).json({ message: 'Invalid reset code' });
      }
      
      // Remove the used OTP for non-phone verification
      otpStore.delete(forgotPasswordKey);
    }
    
    // Find and update user password
    const user = await User.findOne({ phoneOrEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();
    
    console.log(`✅ Password reset successful for ${phoneOrEmail}`);
    res.json({ success: true, message: 'Password reset successfully' });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}

// Verify JWT token and return user data
export async function verify(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'devsecret_fallback_key';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role?: string };
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        walletAddress: user.walletAddress,
        blockchainRegistered: user.blockchainRegistered
      }
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Wallet-based login
export async function walletLogin(req: Request, res: Response) {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'Wallet address is required' 
      });
    }

    console.log(`🔍 Looking for user with wallet address: ${walletAddress}`);

    // Find user by wallet address (case-insensitive)
    const user = await User.findOne({ 
      walletAddress: { $regex: new RegExp(`^${walletAddress}$`, 'i') }
    });
    
    if (!user) {
      console.log(`❌ No user found with wallet address: ${walletAddress}`);
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this wallet address. Please register first or use a different login method.' 
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'devsecret_fallback_key';
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );

    console.log(`✅ Wallet login successful for ${user.fullName} (${user.role})`);
    
    res.json({
      success: true,
      message: 'Wallet login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        walletAddress: user.walletAddress,
        blockchainRegistered: user.blockchainRegistered
      }
    });
  } catch (error) {
    console.error('❌ Wallet login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Wallet login failed' 
    });
  }
}


