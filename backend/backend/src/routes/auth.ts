import express from 'express';
import { 
  login, 
  register, 
  sendOtp, 
  verifyOtp, 
  sendForgotPasswordOtp, 
  resetPassword 
} from '../controllers/authController.js';

const { Router } = express;

const router = Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);

// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Forgot password routes
router.post('/forgot-password', sendForgotPasswordOtp);
router.post('/reset-password', resetPassword);

// Test routes (remove in production)
router.get('/test-twilio', async (req, res) => {
  const { testTwilioConnection } = await import('../services/twilioService.js');
  const isConnected = await testTwilioConnection();
  res.json({ 
    success: isConnected, 
    message: isConnected ? 'Twilio connected successfully' : 'Twilio connection failed' 
  });
});

// Database maintenance route (remove in production)
router.get('/fix-database', async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    
    // Get current indexes
    const indexes = await User.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));
    
    // Drop problematic email index if it exists
    try {
      await User.collection.dropIndex('email_1');
      console.log('✅ Dropped email_1 index');
    } catch (error) {
      console.log('ℹ️ email_1 index does not exist or already dropped');
    }
    
    // Ensure the correct phoneOrEmail index exists
    await User.collection.createIndex({ phoneOrEmail: 1 }, { unique: true });
    console.log('✅ Created phoneOrEmail unique index');
    
    const newIndexes = await User.collection.getIndexes();
    
    res.json({ 
      success: true, 
      message: 'Database indexes fixed',
      oldIndexes: Object.keys(indexes),
      newIndexes: Object.keys(newIndexes)
    });
  } catch (error) {
    console.error('Database fix error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fix database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;


