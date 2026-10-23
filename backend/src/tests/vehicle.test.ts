import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

jest.setTimeout(120000);

describe('Vehicle API', () => {
  let mongod: MongoMemoryServer;
  let adminToken: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    // create admin user
    const admin = new User({ email: 'admin@example.com', passwordHash: 'hashed', role: 'admin' });
    await admin.save();
    adminToken = generateToken({ userId: admin._id.toString(), role: admin.role });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    if (mongoose.connection?.db) {
      const collections = await mongoose.connection.db.collections();
      for (const coll of collections) {
        await coll.deleteMany({});
      }
    }
  });

  it('POST /api/vehicles – admin can create a vehicle', async () => {
    const vehicle = {
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    };
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(vehicle)
      .expect(201);
    expect(res.body).toMatchObject(vehicle);
    expect(res.body).toHaveProperty('_id');
  });

  it('GET /api/vehicles – returns list of vehicles', async () => {
    // seed a vehicle directly via model
    const Vehicle = (await import('../models/Vehicle')).Vehicle;
    await Vehicle.create({
      make: 'Honda',
      model: 'Civic',
      category: 'Compact',
      price: 20000,
      quantity: 3,
    });
    const res = await request(app).get('/api/vehicles').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({ make: 'Honda', model: 'Civic' });
  });

  it('GET /api/vehicles/search – filters by make', async () => {
    const Vehicle = (await import('../models/Vehicle')).Vehicle;
    await Vehicle.create([
      { make: 'Toyota', model: 'Corolla', category: 'Compact', price: 18000, quantity: 4 },
      { make: 'Ford', model: 'F-150', category: 'Truck', price: 30000, quantity: 2 },
    ]);
    const res = await request(app)
      .get('/api/vehicles/search')
      .query({ make: 'Toyota' })
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].make).toBe('Toyota');
  });

  it('POST /api/vehicles/:id/purchase – reduces quantity', async () => {
    const Vehicle = (await import('../models/Vehicle')).Vehicle;
    const veg = await Vehicle.create({
      make: 'Nissan',
      model: 'Altima',
      category: 'Sedan',
      price: 22000,
      quantity: 2,
    });
    const user = new User({ email: 'user@example.com', passwordHash: 'hash', role: 'user' });
    await user.save();
    const userToken = generateToken({ userId: user._id.toString(), role: user.role });
    await request(app)
      .post(`/api/vehicles/${veg._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    const refreshed = await Vehicle.findById(veg._id);
    expect(refreshed?.quantity).toBe(1);
  });

  it('POST /api/vehicles/:id/restock – admin can increase quantity', async () => {
    const Vehicle = (await import('../models/Vehicle')).Vehicle;
    const veh = await Vehicle.create({
      make: 'BMW',
      model: 'X3',
      category: 'SUV',
      price: 45000,
      quantity: 1,
    });
    await request(app)
      .post(`/api/vehicles/${veh._id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 3 })
      .expect(200);
    const updated = await Vehicle.findById(veh._id);
    expect(updated?.quantity).toBe(4);
  });
});
