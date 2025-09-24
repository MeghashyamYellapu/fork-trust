import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpSms, sendForgotPasswordOtpSms, verifyOtpCode } from '../services/twilioService.js';

type Request = express.Request;
type Response = express.Response;

export async function register(req: Request, res: Response) {
  const { phoneOrEmail, password, role, name, otp } = req.body;
  
  if (!phoneOrEmail || !password || !role || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // For development, allow registration without OTP verification
  // In production, uncomment the OTP verification below
  /*
  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }
  
  // Verify OTP before registration
  const stored = otpStore.get(phoneOrEmail);
  if (!stored || Date.now() > stored.expires || stored.otp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  
  // Remove OTP after successful verification
  otpStore.delete(phoneOrEmail);
  */
  
  const existing = await User.findOne({ phoneOrEmail });
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ phoneOrEmail, passwordHash, role, name });
    
    // Generate token for immediate login
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    
    return res.status(201).json({ 
      id: user.id, 
      phoneOrEmail, 
      role, 
      name,
      token 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      if (error.message.includes('email_1')) {
        return res.status(500).json({ 
          message: 'Database configuration error. Please contact support or try the database fix endpoint: GET /api/auth/fix-database' 
        });
      } else {
        return res.status(409).json({ message: 'User already exists' });
      }
    }
    
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
}

export async function login(req: Request, res: Response) {
  const { phoneOrEmail, password } = req.body;
  const user = await User.findOne({ phoneOrEmail });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token, role: user.role, name: user.name });
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


