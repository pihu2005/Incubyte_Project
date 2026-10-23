import mongoose, { Schema, Model, Document } from 'mongoose';

// Interface describing vehicle fields
export interface IVehicle {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

// Mongoose document type that combines Document methods with IVehicle fields
export type VehicleDoc = Omit<Document, 'model'> & IVehicle;

// Define the schema for vehicle documents (field definitions only)
const VehicleSchema = new Schema<any>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

// Export the Mongoose model
export const Vehicle: Model<VehicleDoc> = mongoose.model<VehicleDoc>('Vehicle', VehicleSchema);
