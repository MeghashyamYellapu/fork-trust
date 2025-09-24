import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  quantity: number;
  pricePerKg: number;
  harvestDate: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  validatorsApproved: number;
  totalValidators: number;
  rejectionReason?: string;
  farmer: Types.ObjectId;
  qrCode: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  harvestDate: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  validatorsApproved: { type: Number, default: 0 },
  totalValidators: { type: Number, default: 5 },
  rejectionReason: String,
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qrCode: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);


