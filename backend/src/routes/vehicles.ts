import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware';
import {
  addVehicle,
  getVehicles,
  searchVehicle,
  editVehicle,
  removeVehicle,
  purchase,
  restock,
} from '../controllers/vehicleController';

const router = Router();

// Authenticated users can list and search vehicles
router.get('/', protect, getVehicles);
router.get('/search', protect, searchVehicle);

// Purchase – any authenticated user
router.post('/:id/purchase', protect, purchase);

// Admin‑only routes
router.post('/', protect, adminOnly, addVehicle);
router.put('/:id', protect, adminOnly, editVehicle);
router.delete('/:id', protect, adminOnly, removeVehicle);
router.post('/:id/restock', protect, adminOnly, restock);

export default router;
