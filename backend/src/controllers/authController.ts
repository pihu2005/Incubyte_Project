import { Request, Response } from 'express';
import { registerUser, validateUserCredentials } from '../services/authService';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    const token = generateToken({ userId: user._id.toString(), role: user.role });
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await validateUserCredentials(email, password);
    const token = generateToken({ userId: user._id.toString(), role: user.role });
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
