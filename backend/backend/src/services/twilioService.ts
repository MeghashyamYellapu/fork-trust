import twilio from 'twilio';

let twilioClient: twilio.Twilio | null = null;
let initializationAttempted = false;

// Lazy initialization of Twilio client
function initializeTwilio(): twilio.Twilio | null {
  if (initializationAttempted && twilioClient) {
    return twilioClient;
  }
  
  initializationAttempted = true;
  
  // Get credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  console.log('🔍 Checking Twilio credentials...');
  console.log(`Account SID: ${accountSid ? '✅ Found' : '❌ Missing'}`);
  console.log(`Auth Token: ${authToken ? '✅ Found' : '❌ Missing'}`);
  console.log(`Verify Service SID: ${verifyServiceSid ? '✅ Found' : '❌ Missing'}`);

  if (!accountSid || !authToken || !verifyServiceSid) {
    console.error('❌ Missing Twilio credentials in environment variables');
    console.error('Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID');
    return null;
  }

  try {
    twilioClient = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
    console.log(`📱 Using Verify Service: ${verifyServiceSid}`);
    return twilioClient;
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client:', error);
    return null;
  }
}

// Get the Verify Service SID
function getVerifyServiceSid(): string | null {
  return process.env.TWILIO_VERIFY_SERVICE_SID || null;
}

// Format phone number to international format
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // If it's an Indian number (starts with 6-9 and is 10 digits)
  if (/^[6-9]\d{9}$/.test(cleanPhone)) {
    return `+91${cleanPhone}`;
  }
  
  // If it already has country code
  if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  
  // Default: assume it needs +91 prefix
  return `+91${cleanPhone}`;
}

// Send Registration OTP using Twilio Verify
export async function sendOtpSms(phoneNumber: string): Promise<boolean> {
  const client = initializeTwilio();
  const verifyServiceSid = getVerifyServiceSid();
  
  if (!client || !verifyServiceSid) {
    console.warn('❌ Twilio not configured. OTP would be sent to:', phoneNumber);
    // Fallback: log OTP to console for development
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Development OTP for ${phoneNumber}: ${otp}`);
    return true; // Return true for development
  }

  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log(`📱 Sending registration OTP to ${formattedNumber}`);
    
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({
        to: formattedNumber,
        channel: 'sms'
      });

    console.log(`✅ Registration OTP sent successfully. SID: ${verification.sid}, Status: ${verification.status}`);
    return verification.status === 'pending';
  } catch (error) {
    console.error('❌ Failed to send registration OTP SMS:', error);
    console.log(`⚠️ Twilio Verify failed for ${phoneNumber}`);
    return false;
  }
}

// Send Forgot Password OTP using Twilio Verify
export async function sendForgotPasswordOtpSms(phoneNumber: string): Promise<boolean> {
  const client = initializeTwilio();
  const verifyServiceSid = getVerifyServiceSid();
  
  if (!client || !verifyServiceSid) {
    console.warn('❌ Twilio not configured. Forgot password OTP would be sent to:', phoneNumber);
    // Fallback: log OTP to console for development
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`📱 Development forgot password OTP for ${phoneNumber}: ${otp}`);
    return true; // Return true for development
  }

  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log(`📱 Sending forgot password OTP to ${formattedNumber}`);
    
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({
        to: formattedNumber,
        channel: 'sms'
      });

    console.log(`✅ Forgot password OTP sent successfully. SID: ${verification.sid}, Status: ${verification.status}`);
    return verification.status === 'pending';
  } catch (error) {
    console.error('❌ Failed to send forgot password OTP SMS:', error);
    console.log(`⚠️ Twilio Verify failed for forgot password OTP: ${phoneNumber}`);
    return false;
  }
}

// Verify OTP using Twilio Verify
export async function verifyOtpCode(phoneNumber: string, code: string): Promise<boolean> {
  const client = initializeTwilio();
  const verifyServiceSid = getVerifyServiceSid();
  
  if (!client || !verifyServiceSid) {
    console.warn('❌ Twilio not configured. Would verify OTP for:', phoneNumber);
    // In development, accept any 6-digit code for testing
    return /^\d{6}$/.test(code);
  }

  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log(`📱 Verifying OTP for ${formattedNumber} with code: ${code}`);
    
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({
        to: formattedNumber,
        code: code
      });

    console.log(`✅ OTP verification result: ${verificationCheck.status}`);
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('❌ Failed to verify OTP:', error);
    return false;
  }
}

// Test Twilio connection
export async function testTwilioConnection(): Promise<boolean> {
  try {
    const client = initializeTwilio();
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    
    if (!client || !accountSid) {
      console.log('❌ Twilio client not initialized');
      return false;
    }
    
    // Test by fetching account info
    const account = await client.api.accounts(accountSid).fetch();
    console.log('✅ Twilio connection test successful:', account.friendlyName);
    return true;
  } catch (error) {
    console.error('❌ Twilio connection test failed:', error);
    return false;
  }
}