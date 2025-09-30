// Mock IoT Organic Status Service
// Simulates fetching organic certification status from IoT devices

export interface OrganicIoTData {
  organicStatus: 'certified-organic' | 'natural' | 'conventional' | 'transitional';
  soilPH: number;
  nitrogenLevel: number;
  pesticideResidueLevel: number;
  microorganismCount: number;
  organicMatterPercentage: number;
  lastTested: string;
  deviceId: string;
  confidence: number; // 0-100
  recommendations: string[];
}

export interface IoTSensorData {
  organicData: OrganicIoTData;
  environmentalData: {
    temperature: number;
    humidity: number;
    lastUpdated: string;
  };
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
}

// Mock IoT device responses
const mockIoTDevices = [
  {
    id: 'IOT_SOIL_001',
    location: 'North Field',
    organicCertified: true,
    lastCalibration: '2024-12-15'
  },
  {
    id: 'IOT_SOIL_002', 
    location: 'South Field',
    organicCertified: false,
    lastCalibration: '2024-12-10'
  },
  {
    id: 'IOT_SOIL_003',
    location: 'East Field', 
    organicCertified: true,
    lastCalibration: '2024-12-20'
  }
];

// Simulate network delay
const simulateNetworkDelay = (ms: number = 1000 + Math.random() * 2000) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const fetchOrganicStatusFromIoT = async (): Promise<IoTSensorData> => {
  // Simulate network delay
  await simulateNetworkDelay();
  
  // Randomly select a mock device
  const device = mockIoTDevices[Math.floor(Math.random() * mockIoTDevices.length)];
  
  // Generate realistic organic testing data
  const organicData = generateOrganicData(device);
  
  // Generate environmental data
  const environmentalData = {
    temperature: Math.round(Math.random() * (33 - 18) + 18), // 18-33°C
    humidity: Math.round(Math.random() * (80 - 40) + 40), // 40-80%
    lastUpdated: new Date().toISOString()
  };
  
  // Generate GPS coordinates (Indian agricultural belt)
  const gpsCoordinates = {
    latitude: Math.round((Math.random() * (28 - 20) + 20) * 1000000) / 1000000, // 20-28°N
    longitude: Math.round((Math.random() * (87 - 77) + 77) * 1000000) / 1000000  // 77-87°E
  };
  
  return {
    organicData,
    environmentalData,
    gpsCoordinates
  };
};

const generateOrganicData = (device: typeof mockIoTDevices[0]): OrganicIoTData => {
  const isOrganic = device.organicCertified && Math.random() > 0.2; // 80% accuracy for organic fields
  
  let organicStatus: OrganicIoTData['organicStatus'];
  let soilPH: number;
  let nitrogenLevel: number;
  let pesticideResidueLevel: number;
  let microorganismCount: number;
  let organicMatterPercentage: number;
  let confidence: number;
  let recommendations: string[];
  
  if (isOrganic) {
    // Organic field characteristics
    organicStatus = Math.random() > 0.3 ? 'certified-organic' : 'natural';
    soilPH = 6.0 + Math.random() * 1.5; // 6.0-7.5 (ideal for organic)
    nitrogenLevel = 15 + Math.random() * 20; // 15-35 ppm (moderate, sustainable)
    pesticideResidueLevel = Math.random() * 0.5; // 0-0.5 ppm (very low)
    microorganismCount = 800000 + Math.random() * 400000; // High beneficial microorganisms
    organicMatterPercentage = 3.5 + Math.random() * 2.5; // 3.5-6% (high organic matter)
    confidence = 85 + Math.random() * 15; // 85-100% confidence
    recommendations = [
      'Soil health excellent for organic certification',
      'Continue current organic practices',
      'Monitor for beneficial insect populations',
      'Consider crop rotation for nutrient balance'
    ];
  } else if (Math.random() > 0.4) {
    // Transitional (converting to organic)
    organicStatus = 'transitional';
    soilPH = 5.8 + Math.random() * 1.7; // 5.8-7.5
    nitrogenLevel = 25 + Math.random() * 25; // 25-50 ppm
    pesticideResidueLevel = 0.5 + Math.random() * 2; // 0.5-2.5 ppm (reducing)
    microorganismCount = 400000 + Math.random() * 600000;
    organicMatterPercentage = 2.0 + Math.random() * 2.5; // 2-4.5%
    confidence = 70 + Math.random() * 20; // 70-90% confidence
    recommendations = [
      'Soil transitioning to organic standards',
      'Reduce synthetic inputs gradually',
      'Increase organic matter through composting',
      'Monitor pesticide residue levels monthly'
    ];
  } else {
    // Conventional farming
    organicStatus = 'conventional';
    soilPH = 5.5 + Math.random() * 2.5; // 5.5-8.0 (wider range)
    nitrogenLevel = 40 + Math.random() * 40; // 40-80 ppm (higher synthetic inputs)
    pesticideResidueLevel = 2 + Math.random() * 8; // 2-10 ppm (higher residues)
    microorganismCount = 200000 + Math.random() * 400000; // Lower beneficial microorganisms  
    organicMatterPercentage = 1.5 + Math.random() * 2; // 1.5-3.5%
    confidence = 75 + Math.random() * 20; // 75-95% confidence
    recommendations = [
      'Conventional farming detected',
      'Consider reducing synthetic fertilizer use',
      'Implement integrated pest management',
      'Test soil health regularly for improvements'
    ];
  }
  
  return {
    organicStatus,
    soilPH: Math.round(soilPH * 100) / 100,
    nitrogenLevel: Math.round(nitrogenLevel * 10) / 10,
    pesticideResidueLevel: Math.round(pesticideResidueLevel * 100) / 100,
    microorganismCount: Math.round(microorganismCount),
    organicMatterPercentage: Math.round(organicMatterPercentage * 100) / 100,
    lastTested: new Date().toISOString(),
    deviceId: device.id,
    confidence: Math.round(confidence * 10) / 10,
    recommendations
  };
};

// Get organic status display info
export const getOrganicStatusInfo = (status: OrganicIoTData['organicStatus']) => {
  switch (status) {
    case 'certified-organic':
      return {
        label: 'Certified Organic',
        color: 'text-green-700 bg-green-100',
        icon: '🌱',
        description: 'Meets all organic certification standards'
      };
    case 'natural':
      return {
        label: 'Natural',
        color: 'text-green-600 bg-green-50',
        icon: '🍃',
        description: 'Natural farming practices, no synthetic chemicals'
      };
    case 'transitional':
      return {
        label: 'Transitional Organic',
        color: 'text-yellow-700 bg-yellow-100',
        icon: '🌿',
        description: 'Converting to organic, 2-3 years in progress'
      };
    case 'conventional':
      return {
        label: 'Conventional',
        color: 'text-orange-600 bg-orange-50',
        icon: '🌾',
        description: 'Standard farming with synthetic inputs'
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-600 bg-gray-100',
        icon: '❓',
        description: 'Status not determined'
      };
  }
};