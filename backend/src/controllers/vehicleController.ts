import { Request, Response } from 'express';
import {
  createVehicle,
  listVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../services/vehicleService';

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await listVehicles();
    res.json(vehicles);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const searchVehicle = async (req: Request, res: Response) => {
  try {
    const results = await searchVehicles(req.query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const editVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updated = await updateVehicle(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await deleteVehicle(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const purchase = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const vehicle = await purchaseVehicle(id);
    res.json(vehicle);
  } catch (err: any) {
    const status = err.message === 'Out of stock' ? 400 : 404;
    res.status(status).json({ message: err.message });
  }
};

export const restock = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const amount = Number(req.body.amount);
    const vehicle = await restockVehicle(id, amount);
    res.json(vehicle);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
