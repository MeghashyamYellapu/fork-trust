import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'producer' | 'quality-inspector' | 'distributor' | 'retailer' | 'consumer';

export interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  aadharNumber: string;
  passwordHash: string;
  role: UserRole;
  
  // Location fields
  state?: string;
  district?: string;
  address?: string;
  pincode?: string;
  
  // Producer/Farmer specific fields
  farmName?: string;
  farmLocation?: string;
  landSize?: string;
  cropTypes?: string;
  
  // Distributor specific fields
  companyName?: string;
  businessName?: string;
  licenseNumber?: string;
  operatingRegion?: string;
  businessLicense?: string;
  
  // Retailer specific fields
  shopName?: string;
  shopLocation?: string;
  gstNumber?: string;
  
  // Quality Inspector specific fields
  organizationName?: string;
  designation?: string;
  validationId?: string;
  certificationDetails?: string;
  experience?: string;
  
  // Consumer specific fields
  pinCode?: string;
  preferredLanguage?: string;
  
  // Blockchain fields
  walletAddress?: string;
  blockchainRegistered?: boolean;
  registrationTimestamp?: string;
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  aadharNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['producer', 'quality-inspector', 'distributor', 'retailer', 'consumer'], 
    required: true 
  },
  
  // Location fields
  state: { type: String },
  district: { type: String },
  address: { type: String },
  pincode: { type: String },
  
  // Producer/Farmer specific fields
  farmName: { type: String },
  farmLocation: { type: String },
  landSize: { type: String },
  cropTypes: { type: String },
  
  // Distributor specific fields
  companyName: { type: String },
  businessName: { type: String },
  licenseNumber: { type: String },
  operatingRegion: { type: String },
  businessLicense: { type: String },
  
  // Retailer specific fields
  shopName: { type: String },
  shopLocation: { type: String },
  gstNumber: { type: String },
  
  // Quality Inspector specific fields
  organizationName: { type: String },
  designation: { type: String },
  validationId: { type: String },
  certificationDetails: { type: String },
  experience: { type: String },
  
  // Consumer specific fields
  pinCode: { type: String },
  preferredLanguage: { type: String },
  
  // Blockchain fields
  walletAddress: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
  blockchainRegistered: { type: Boolean, default: false },
  registrationTimestamp: { type: String }
}, { 
  timestamps: true
});

// Create indexes for non-unique fields only
UserSchema.index({ role: 1 });

// Virtual field to maintain backward compatibility  
UserSchema.virtual('phoneOrEmail').get(function(this: IUser) {
  return this.phoneNumber;
});

UserSchema.virtual('name').get(function(this: IUser) {
  return this.fullName;
});

export default mongoose.model<IUser>('User', UserSchema);


