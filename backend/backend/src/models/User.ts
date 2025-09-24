import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'farmer' | 'validator' | 'distributor' | 'retailer' | 'consumer';

export interface IUser extends Document {
  phoneOrEmail: string;
  passwordHash: string;
  role: UserRole;
  name: string;
}

const UserSchema = new Schema<IUser>({
  phoneOrEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'validator', 'distributor', 'retailer', 'consumer'], required: true },
  name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);


