import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'te' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Hero Section
  heroTitle: {
    en: "Farm-to-Consumer Transparency & Intelligence Powered by Blockchain , Beckn & AI",
    te: "ఫార్మ్-టు-కన్స్యూమర్ పారదర్శకత & మేధస్సు Blockchain , Beckn & AI ద్వారా ఆధారితం",
    hi: "खेत-से-उपभोक्ता पारदर्शिता और बुद्धिमत्ता ब्लॉकचेन, बेकन और एआई द्वारा संचालित"
  },
  heroSubtitle: {
    en: "Connecting farmers, distributors, and consumers through transparent, verified supply chains",
    te: "పారదర్శక, ధృవీకరించబడిన సప్లై చెయిన్ ద్వారా రైతులు, పంపిణీదారులు మరియు వినియోగదారులను కలుపుతుంది",
    hi: "पारदर्शी, सत्यापित आपूर्ति श्रृंखला के माध्यम से किसानों, वितरकों और उपभोक्ताओं को जोड़ना"
  },
  register: {
    en: "Register",
    te: "నమోదు",
    hi: "पंजीकरण"
  },
  login: {
    en: "Login",
    te: "లాగిన్",
    hi: "लॉगिन"
  },
  scanQR: {
    en: "Scan QR Code",
    te: "QR కోడ్ స్కాన్ చేయండి",
    hi: "QR कोड स्कैन करें"
  },
  
  // About Section
  aboutTitle: {
    en: "Why Choose Our Platform?",
    te: "మా ప్లాట్‌ఫారమ్‌ను ఎందుకు ఎంచుకోవాలి?",
    hi: "हमारा प्लेटफॉर्म क्यों चुनें?"
  },
  transparency: {
    en: "Complete Transparency",
    te: "పూర్తి పారదర్శకత",
    hi: "पूर्ण पारदर्शिता"
  },
  transparencyDesc: {
    en: "Track every step from farm to your table with blockchain verification",
    te: "బ్లాక్‌చెయిన్ ధృవీకరణతో వ్యవసాయం నుండి మీ టేబుల్ వరకు ప్రతి దశను ట్రాక్ చేయండి",
    hi: "ब्लॉकचेन सत्यापन के साथ खेत से आपकी मेज तक हर कदम को ट्रैक करें"
  },
  fairPricing: {
    en: "Fair Pricing",
    te: "న్యాయమైన ధర",
    hi: "निष्पक्ष मूल्य निर्धारण"
  },
  fairPricingDesc: {
    en: "AI-powered market analysis ensures fair prices for farmers and consumers",
    te: "AI-ఆధారిత మార్కెట్ విశ్లేషణ రైతులు మరియు వినియోగదారులకు న్యాయమైన ధరలను నిర్ధారిస్తుంది",
    hi: "AI-संचालित बाजार विश्लेषण किसानों और उपभोक्ताओं के लिए उचित मूल्य सुनिश्चित करता है"
  },
  qualityTracking: {
    en: "Quality Assurance",
    te: "నాణ్యత హామీ",
    hi: "गुणवत्ता आश्वासन"
  },
  qualityTrackingDesc: {
    en: "Multi-validator consensus ensures only premium quality produce reaches markets",
    te: "మల్టీ-వేలిడేటర్ సమ్మతి మార్కెట్లకు అత్యుత్తమ నాణ్యత ఉత్పాదనలు మాత్రమే చేరేలా చేస్తుంది",
    hi: "मल्टी-वैलिडेटर सर्वसम्मति सुनिश्चित करती है कि केवल प्रीमियम गुणवत्ता का उत्पादन बाजारों तक पहुंचे"
  },

  // How It Works
  howItWorksTitle: {
    en: "How It Works",
    te: "ఇది ఎలా పనిచేస్తుంది",
    hi: "यह कैसे काम करता है"
  },
  step1: {
    en: "Farmer Uploads",
    te: "రైతు అప్‌లోడ్",
    hi: "किसान अपलोड"
  },
  step1Desc: {
    en: "Farmers upload produce details with photos and harvest information",
    te: "రైతులు ఫోటోలు మరియు పంట సమాచారంతో ఉత్పత్తి వివరాలను అప్‌లోడ్ చేస్తారు",
    hi: "किसान फोटो और फसल की जानकारी के साथ उत्पादन विवरण अपलोड करते हैं"
  },
  step2: {
    en: "Validators Verify",
    te: "వేలిడేటర్లు ధృవీకరిస్తారు",
    hi: "वैलिडेटर सत्यापित करते हैं"
  },
  step2Desc: {
    en: "Multiple expert validators verify quality and authenticity",
    te: "అనేక నిపుణ వేలిడేటర్లు నాణ్యత మరియు ప్రామాణికతను ధృవీకరిస్తారు",
    hi: "कई विशेषज्ञ वैलिडेटर गुणवत्ता और प्रामाणिकता को सत्यापित करते हैं"
  },
  step3: {
    en: "Blockchain Records",
    te: "బ్లాక్‌చెయిన్ రికార్డ్స్",
    hi: "ब्लॉकचेन रिकॉर्ड"
  },
  step3Desc: {
    en: "Verified data is permanently stored on the blockchain",
    te: "ధృవీకరించబడిన డేటా బ్లాక్‌చెయిన్‌లో శాశ్వతంగా నిల్వ చేయబడుతుంది",
    hi: "सत्यापित डेटा स्थायी रूप से ब्लॉकचेन पर संग्रहीत होता है"
  },
  step4: {
    en: "Consumer Scans",
    te: "వినియోగదారు స్కాన్",
    hi: "उपभोक्ता स्कैन"
  },
  step4Desc: {
    en: "Consumers scan QR codes to view complete product journey",
    te: "వినియోగదారులు పూర్తి ఉత్పత్తి ప్రయాణాన్ని చూడటానికి QR కోడ్‌లను స్కాన్ చేస్తారు",
    hi: "उपभोक्ता पूरी उत्पाद यात्रा देखने के लिए QR कोड स्कैन करते हैं"
  },

  // QR Scanner
  scanProduct: {
    en: "Scan Product QR Code",
    te: "ఉత్పత్తి QR కోడ్ స్కాన్ చేయండి",
    hi: "उत्पाद QR कोड स्कैन करें"
  },
  scanInstructions: {
    en: "Point your camera at the QR code or upload an image",
    te: "QR కోడ్‌పై మీ కెమెరాను పాయింట్ చేయండి లేదా చిత్రాన్ని అప్‌లోడ్ చేయండి",
    hi: "अपना कैमरा QR कोड पर इंगित करें या एक छवि अपलोड करें"
  },
  useCamera: {
    en: "Use Camera",
    te: "కెమెరా ఉపయోగించండి",
    hi: "कैमरा का उपयोग करें"
  },
  uploadImage: {
    en: "Upload Image",
    te: "చిత్రం అప్‌లోడ్ చేయండి",
    hi: "छवि अपलोड करें"
  },
  close: {
    en: "Close",
    te: "మూసివేయండి",
    hi: "बंद करें"
  },

  // Dashboard translations
  dashboard: {
    en: "Dashboard",
    te: "డాష్‌బోర్డ్",
    hi: "डैशबोर्ड"
  },
  distributorDashboard: {
    en: "Distributor Dashboard",
    te: "పంపిణీదారు డాష్‌బోర్డ్",
    hi: "वितरक डैशबोर्ड"
  },
  availableProducts: {
    en: "Available Products",
    te: "అందుబాటులో ఉన్న ఉత్పత్తులు",
    hi: "उपलब्ध उत्पाद"
  },
  orderManagement: {
    en: "Order Management",
    te: "ఆర్డర్ నిర్వహణ",
    hi: "ऑर्डर प्रबंधन"
  },
  totalOrders: {
    en: "Total Orders",
    te: "మొత్తం ఆర్డర్లు",
    hi: "कुल ऑर्डर"
  },
  activeOrders: {
    en: "Active Orders",
    te: "క్రియాశీల ఆర్డర్లు",
    hi: "सक्रिय ऑर्डर"
  },
  completed: {
    en: "Completed",
    te: "పూర్తయింది",
    hi: "पूर्ण"
  },
  blockchainVerified: {
    en: "Blockchain Verified",
    te: "బ్లాక్‌చెయిన్ ధృవీకరించబడింది",
    hi: "ब्लॉकचेन सत्यापित"
  },
  farmerInfo: {
    en: "Farmer Information",
    te: "రైతు సమాచారం",
    hi: "किसान की जानकारी"
  },
  supplyChainJourney: {
    en: "Supply Chain Journey",
    te: "సప్లై చెయిన్ ప్రయాణం",
    hi: "आपूर्ति श्रृंखला यात्रा"
  },
  qualityVerification: {
    en: "Quality Verification Report",
    te: "నాణ్యత ధృవీకరణ నివేదిక",
    hi: "गुणवत्ता सत्यापन रिपोर्ट"
  },
  sustainabilityReport: {
    en: "Sustainability Report",
    te: "స్థిరత్వ నివేదిక",
    hi: "स्थिरता रिपोर्ट"
  },
  rateProduct: {
    en: "Rate This Product",
    te: "ఈ ఉత్పత్తిని రేట్ చేయండి",
    hi: "इस उत्पाद को रेट करें"
  },
  backToHome: {
    en: "Back to Home",
    te: "హోమ్‌కు తిరిగి",
    hi: "होम पर वापस"
  },
  orderNow: {
    en: "Order Now",
    te: "ఇప్పుడే ఆర్డర్ చేయండి",
    hi: "अभी ऑर्डर करें"
  },
  submitFeedback: {
    en: "Submit Feedback",
    te: "అభిప్రాయాన్ని సమర్పించండి",
    hi: "फीडबैक सबमिट करें"
  },

  // Common / Auth / Navigation
  welcomeBack: {
    en: "Welcome Back",
    te: "తిరిగి స్వాగతం",
    hi: "वापसी पर स्वागत है"
  },
  signInToAccount: {
    en: "Sign in to your account",
    te: "మీ ఖాతాలో సైన్ ఇన్ చేయండి",
    hi: "अपने खाते में साइन इन करें"
  },
  password: {
    en: "Password",
    te: "పాస్‌వర్డ్",
    hi: "पासवर्ड"
  },
  otp: {
    en: "OTP",
    te: "OTP",
    hi: "OTP"
  },
  phoneOrEmailLabel: {
    en: "Phone Number or Email",
    te: "ఫోన్ నంబర్ లేదా ఈమెయిల్",
    hi: "फोन नंबर या ईमेल"
  },
  enterPhoneOrEmail: {
    en: "Enter phone number or email",
    te: "ఫోన్ నంబర్ లేదా ఈమెయిల్ నమోదు చేయండి",
    hi: "फोन नंबर या ईमेल दर्ज करें"
  },
  enterPassword: {
    en: "Enter your password",
    te: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    hi: "अपना पासवर्ड दर्ज करें"
  },
  forgotPassword: {
    en: "Forgot Password?",
    te: "పాస్‌వర్డ్ మర్చిపోయారా?",
    hi: "पासवर्ड भूल गए?"
  },
  signIn: {
    en: "Sign In",
    te: "సైన్ ఇన్",
    hi: "साइन इन"
  },
  sending: {
    en: "Sending...",
    te: "పంపుతోంది...",
    hi: "भेजा जा रहा है..."
  },
  sendOTP: {
    en: "Send OTP",
    te: "OTP పంపండి",
    hi: "OTP भेजें"
  },
  verifying: {
    en: "Verifying...",
    te: "ధృవీకరిస్తోంది...",
    hi: "सत्यापित किया जा रहा है..."
  },
  verifyAndSignIn: {
    en: "Verify & Sign In",
    te: "ధృవీకరించి సైన్ ఇన్ చేయండి",
    hi: "सत्यापित करके साइन इन करें"
  },
  logout: {
    en: "Logout",
    te: "లాగౌట్",
    hi: "लॉगआउट"
  },

  // Page Titles
  createAccount: {
    en: "Create Account",
    te: "ఖాతా సృష్టించండి",
    hi: "खाता बनाएं"
  },
  joinSubtitle: {
    en: "Join the transparent farming revolution",
    te: "పారదర్శక వ్యవసాయ విప్లవంలో చేరండి",
    hi: "पारदर्शी खेती क्रांति में शामिल हों"
  },
  basicInformation: {
    en: "Basic Information",
    te: "మూల సమాచారం",
    hi: "मूल जानकारी"
  },
  fullName: {
    en: "Full Name",
    te: "పూర్తి పేరు",
    hi: "पूरा नाम"
  },
  phoneNumber: {
    en: "Phone Number",
    te: "ఫోన్ నంబర్",
    hi: "फोन नंबर"
  },
  enterFullName: {
    en: "Enter your full name",
    te: "మీ పూర్తి పేరు నమోదు చేయండి",
    hi: "अपना पूरा नाम दर्ज करें"
  },
  mobile10Digit: {
    en: "10-digit mobile number",
    te: "10-అంకెల మొబైల్ నంబర్",
    hi: "10-अंकों का मोबाइल नंबर"
  },
  confirmPassword: {
    en: "Confirm Password",
    te: "పాస్‌వర్డ్ నిర్ధారించండి",
    hi: "पासवर्ड की पुष्टि करें"
  },
  min6Chars: {
    en: "Minimum 6 characters",
    te: "కనీసం 6 అక్షరాలు",
    hi: "कम से कम 6 अक्षर"
  },
  reenterPassword: {
    en: "Re-enter password",
    te: "పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి",
    hi: "पासवर्ड फिर से दर्ज करें"
  },
  enterOTP: {
    en: "Enter OTP",
    te: "OTP నమోదు చేయండి",
    hi: "OTP दर्ज करें"
  },
  createAccountBtn: {
    en: "Create Account",
    te: "ఖాతా సృష్టించండి",
    hi: "खाता बनाएं"
  },
  creatingAccountLoading: {
    en: "Creating Account...",
    te: "ఖాతాను సృష్టిస్తోంది...",
    hi: "खाता बनाया जा रहा है..."
  },
  sendOtpAndContinue: {
    en: "Send OTP & Continue",
    te: "OTP పంపి కొనసాగించండి",
    hi: "OTP भेजें और जारी रखें"
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    te: "ఇప్పటికే ఖాతా ఉందా?",
    hi: "क्या आपका पहले से खाता है?"
  },
  loginHere: {
    en: "Login here",
    te: "ఇక్కడ లాగిన్ చేయండి",
    hi: "यहां लॉगिन करें"
  },

  // Register extra fields
  aadharNumberLabel: {
    en: "Aadhar Number",
    te: "ఆధార్ నంబర్",
    hi: "आधार नंबर"
  },
  aadhar12Digit: {
    en: "12-digit Aadhar number",
    te: "12-అంకెల ఆధార్ నంబర్",
    hi: "12-अंकों का आधार नंबर"
  },

  preferredLanguage: {
    en: "Preferred Language",
    te: "ప్రాధాన్య భాష",
    hi: "पसंदीदा भाषा"
  },
  selectLanguage: {
    en: "Select language",
    te: "భాషను ఎంచుకోండి",
    hi: "भाषा चुनें"
  },
  english: {
    en: "English",
    te: "ఇంగ్లీష్",
    hi: "अंग्रेज़ी"
  },
  telugu: {
    en: "తెలుగు",
    te: "తెలుగు",
    hi: "तेलुगू"
  },
  hindi: {
    en: "हिंदी",
    te: "హిందీ",
    hi: "हिंदी"
  },

  // Role-specific labels (farmer/distributor/retailer/validator)
  farmName: {
    en: "Farm Name",
    te: "వ్యవసాయ క్షేత్రం పేరు",
    hi: "खेत का नाम"
  },
  enterFarmName: {
    en: "Enter farm name",
    te: "ఫార్మ్ పేరు నమోదు చేయండి",
    hi: "खेत का नाम दर्ज करें"
  },
  farmLocation: {
    en: "Farm Location",
    te: "వ్యవసాయ క్షేత్రం స్థానం",
    hi: "खेत का स्थान"
  },
  villageDistrictState: {
    en: "Village, District, State",
    te: "గ్రామం, జిల్లా, రాష్ట్రం",
    hi: "गाँव, जिला, राज्य"
  },
  landSize: {
    en: "Land Size",
    te: "భూమి పరిమాణం",
    hi: "भूमि का आकार"
  },
  acresOrHectares: {
    en: "Acres or Hectares",
    te: "ఎకరాలు లేదా హెక్టార్లు",
    hi: "एकड़ या हेक्टेयर"
  },
  companyName: {
    en: "Company Name",
    te: "కంపెనీ పేరు",
    hi: "कंपनी का नाम"
  },
  licenseNumber: {
    en: "License Number",
    te: "లైసెన్స్ నంబర్",
    hi: "लाइसेंस नंबर"
  },
  operatingRegion: {
    en: "Operating Region",
    te: "వ్యాపార ప్రాంతం",
    hi: "संचालन क्षेत्र"
  },
  shopName: {
    en: "Shop Name",
    te: "దుకాణం పేరు",
    hi: "दुकान का नाम"
  },
  shopLocation: {
    en: "Shop Location",
    te: "దుకాణం స్థానం",
    hi: "दुकान का स्थान"
  },
  gstNumber: {
    en: "GST Number",
    te: "GST నంబర్",
    hi: "GST नंबर"
  },
  organizationName: {
    en: "Organization Name",
    te: "సంస్థ పేరు",
    hi: "संगठन का नाम"
  },
  designation: {
    en: "Designation",
    te: "హోదా",
    hi: "पदनाम"
  },
  validationId: {
    en: "Validation ID",
    te: "ధృవీకరణ ID",
    hi: "सत्यापन ID"
  },
  governmentIssuedId: {
    en: "Government-issued ID",
    te: "ప్రభుత్వం జారీ చేసిన ID",
    hi: "सरकार द्वारा जारी ID"
  },
  // Register - Roles
  selectYourRole: {
    en: "Select Your Role",
    te: "మీ పాత్రను ఎంచుకోండి",
    hi: "अपनी भूमिका चुनें"
  },
  iAmA: {
    en: "I am a",
    te: "నేను",
    hi: "मैं हूँ"
  },
  // Simple role keys
  farmer: {
    en: "Farmer",
    te: "రైతు",
    hi: "किसान"
  },
  distributor: {
    en: "Distributor",
    te: "పంపిణీదారు",
    hi: "वितरक"
  },
  retailer: {
    en: "Retailer",
    te: "రిటైలర్",
    hi: "खुदरा विक्रेता"
  },
  validator: {
    en: "Validator",
    te: "వేలిడేటర్",
    hi: "सत्यापनकर्ता"
  },
  consumer: {
    en: "Consumer",
    te: "వినియోగదారు",
    hi: "उपभोक्ता"
  },
  // Farmer Dashboard
  overview: {
    en: "Overview",
    te: "అవలోకనం",
    hi: "सारांश"
  },
  addProduct: {
    en: "Add Product",
    te: "ఉత్పత్తిని జోడించండి",
    hi: "उत्पाद जोड़ें"
  },
  pendingApprovals: {
    en: "Pending Approvals",
    te: "పెండింగ్ ఆమోదాలు",
    hi: "लंबित अनुमोदन"
  },
  marketPrices: {
    en: "Market Prices",
    te: "మార్కెట్ ధరలు",
    hi: "बाज़ार मूल्य"
  },
  history: {
    en: "History",
    te: "చరిత్ర",
    hi: "इतिहास"
  },
  recentProducts: {
    en: "Recent Products",
    te: "తాజా ఉత్పత్తులు",
    hi: "हाल के उत्पाद"
  },
  quickActions: {
    en: "Quick Actions",
    te: "త్వరిత చర్యలు",
    hi: "त्वरित क्रियाएँ"
  },
  addNewProduct: {
    en: "Add New Product",
    te: "కొత్త ఉత్పత్తిని జోడించండి",
    hi: "नया उत्पाद जोड़ें"
  },
  viewPendingApprovals: {
    en: "View Pending Approvals",
    te: "పెండింగ్ ఆమోదాలను చూడండి",
    hi: "लंबित अनुमोदन देखें"
  },
  checkMarketPrices: {
    en: "Check Market Prices",
    te: "మార్కెట్ ధరలను తనిఖీ చేయండి",
    hi: "बाज़ार मूल्य देखें"
  },
  addNewProductTitle: {
    en: "Add New Product",
    te: "కొత్త ఉత్పత్తిని జోడించండి",
    hi: "नया उत्पाद जोड़ें"
  },
  productImages: {
    en: "Product Images",
    te: "ఉత్పత్తి చిత్రాలు",
    hi: "उत्पाद चित्र"
  },
  uploadProductImages: {
    en: "Upload product images",
    te: "ఉత్పత్తి చిత్రాలను అప్‌లోడ్ చేయండి",
    hi: "उत्पाद की तस्वीरें अपलोड करें"
  },
  chooseImages: {
    en: "Choose Images",
    te: "చిత్రాలను ఎంచుకోండి",
    hi: "छवियाँ चुनें"
  },
  productName: {
    en: "Product Name",
    te: "ఉత్పత్తి పేరు",
    hi: "उत्पाद का नाम"
  },
  selectProduct: {
    en: "Select product",
    te: "ఉత్పత్తిని ఎంచుకోండి",
    hi: "उत्पाद चुनें"
  },
  quantityKg: {
    en: "Quantity (kg)",
    te: "పరిమాణం (kg)",
    hi: "मात्रा (किलो)"
  },
  enterQuantityKg: {
    en: "Enter quantity in kg",
    te: "కిలోల్లో పరిమాణాన్ని నమోదు చేయండి",
    hi: "किलो में मात्रा दर्ज करें"
  },
  pricePerKgCurrency: {
    en: "Price per Kg (₹)",
    te: "కిలోకు ధర (₹)",
    hi: "प्रति किलो कीमत (₹)"
  },
  enterPricePerKg: {
    en: "Enter price per kg",
    te: "కిలోకు ధరను నమోదు చేయండి",
    hi: "प्रति किलो कीमत दर्ज करें"
  },
  recommendedLabel: {
    en: "Recommended:",
    te: "సిఫార్సు:",
    hi: "अनुशंसित:"
  },
  harvestDateLabel: {
    en: "Harvest Date",
    te: "పంట తేది",
    hi: "कटाई की तारीख"
  },
  descriptionOptional: {
    en: "Description (Optional)",
    te: "వివరణ (ఐచ్చికం)",
    hi: "विवरण (वैकल्पिक)"
  },
  addlDetailsPlaceholder: {
    en: "Add any additional details about your product",
    te: "మీ ఉత్పత్తి గురించి అదనపు వివరాలు జోడించండి",
    hi: "अपने उत्पाद के बारे में अतिरिक्त विवरण जोड़ें"
  },
  submitForValidation: {
    en: "Submit for Validation",
    te: "ధృవీకరణకు సమర్పించండి",
    hi: "सत्यापन के लिए सबमिट करें"
  },
  productsAwaitingApproval: {
    en: "Products awaiting validator approval",
    te: "వేలిడేటర్ ఆమోదం కోసం వేచి ఉన్న ఉత్పత్తులు",
    hi: "वैलिडेटर की स्वीकृति की प्रतीक्षा कर रहे उत्पाद"
  },
  validatorsLabel: {
    en: "validators",
    te: "వేలిడేటర్లు",
    hi: "वैलिडेटर"
  },
  rejectionReasonLabel: {
    en: "Rejection Reason:",
    te: "తిరస్కరణ కారణం:",
    hi: "अस्वीकृति का कारण:"
  },
  marketPriceDashboard: {
    en: "Market Price Dashboard",
    te: "మార్కెట్ ధర డాష్‌బోర్డ్",
    hi: "बाज़ार मूल्य डैशबोर्ड"
  },
  fairPricingRecommendations: {
    en: "AI-powered fair pricing recommendations",
    te: "AI ఆధారిత న్యాయమైన ధరల సిఫార్సులు",
    hi: "AI-संचालित उचित मूल्य सिफारिशें"
  },
  marketPrice: {
    en: "Market Price:",
    te: "మార్కెట్ ధర:",
    hi: "बाज़ार मूल्य:"
  },
  recommended: {
    en: "Recommended:",
    te: "సిఫార్సు:",
    hi: "अनुशंसित:"
  },
  profitMargin: {
    en: "Profit Margin:",
    te: "లాభ మార్జిన్:",
    hi: "लाभ मार्जिन:"
  },
  productHistory: {
    en: "Product History",
    te: "ఉత్పత్తి చరిత్ర",
    hi: "उत्पाद इतिहास"
  },
  pastUploadsAndSales: {
    en: "Your past uploads and sales",
    te: "మీ గత అప్‌లోడ్లు మరియు అమ్మకాలు",
    hi: "आपके पिछले अपलोड और बिक्री"
  },
  statusApproved: {
    en: "Approved",
    te: "ఆమోదించబడింది",
    hi: "स्वीकृत"
  },
  statusPendingReview: {
    en: "Pending Review",
    te: "సమీక్ష పెండింగ్",
    hi: "समीक्षा लंबित"
  },
  statusRejected: {
    en: "Rejected",
    te: "తిరస్కరించబడింది",
    hi: "अस्वीकृत"
  },
  statusUnknown: {
    en: "Unknown",
    te: "తెలియదు",
    hi: "अज्ञात"
  },
  basedOnMarketAnalysis: {
    en: "based on market analysis",
    te: "మార్కెట్ విశ్లేషణ ఆధారంగా",
    hi: "बाज़ार विश्लेषण के आधार पर"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('app_language') : null;
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_language', language);
    } catch {}
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};