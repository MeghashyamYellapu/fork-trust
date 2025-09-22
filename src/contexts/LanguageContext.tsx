import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    en: "Farm-to-Fork Transparency, Powered by Blockchain",
    te: "బ్లాక్‌చెయిన్ ద్వారా సంపూర్ణ వ్యవసాయ పారదర్శకత",
    hi: "ब्लॉकचेन द्वारा संचालित खेत-से-कांटा पारदर्शिता"
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
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

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