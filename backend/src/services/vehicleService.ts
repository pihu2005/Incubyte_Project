import { Vehicle, IVehicle } from '../models/Vehicle';
import { Types } from 'mongoose';

export const createVehicle = async (data: Partial<IVehicle>): Promise<IVehicle> => {
  const vehicle = new Vehicle(data);
  await vehicle.save();
  return vehicle;
};

export const listVehicles = async (): Promise<IVehicle[]> => {
  return Vehicle.find();
};

export const searchVehicles = async (query: any): Promise<IVehicle[]> => {
  const filter: any = {};
  if (query.make) filter.make = { $regex: query.make, $options: 'i' };
  if (query.model) filter.model = { $regex: query.model, $options: 'i' };
  if (query.category) filter.category = { $regex: query.category, $options: 'i' };
  if (query.minPrice) filter.price = { ...filter.price, $gte: Number(query.minPrice) };
  if (query.maxPrice) filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  return Vehicle.find(filter);
};

export const updateVehicle = async (id: string, data: Partial<IVehicle>): Promise<IVehicle | null> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid vehicle id');
  return Vehicle.findByIdAndUpdate(id, data, { new: true });
};

export const deleteVehicle = async (id: string): Promise<void> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid vehicle id');
  await Vehicle.findByIdAndDelete(id);
};

export const purchaseVehicle = async (id: string): Promise<IVehicle> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid vehicle id');
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new Error('Vehicle not found');
  if (vehicle.quantity <= 0) throw new Error('Out of stock');
  vehicle.quantity -= 1;
  await vehicle.save();
  return vehicle;
};

export const restockVehicle = async (id: string, amount: number): Promise<IVehicle> => {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid vehicle id');
  if (amount <= 0) throw new Error('Restock amount must be positive');
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new Error('Vehicle not found');
  vehicle.quantity += amount;
  await vehicle.save();
  return vehicle;
};
