import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const registerUser = async (email: string, password: string): Promise<IUser> => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('User already exists');
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ email, passwordHash, role: 'user' });
  await user.save();
  return user;
};

export const validateUserCredentials = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  return user;
};
