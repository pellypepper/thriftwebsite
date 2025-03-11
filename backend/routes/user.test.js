const request = require('supertest');
const express = require('express');
const pool = require('../../database/db');
const userRoutes = require('./user');
const verifyToken = require('../auth/auth');
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('../../database/db');
jest.mock('../auth/auth', () => jest.fn((req, res, next) => {
  req.userId = 'test-clerk-id';
  req.email = 'test@example.com';
  next();
}));

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

describe('User Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /user/auth', () => {
    it('should create a new user if not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }) // Simulate user not found
                .mockResolvedValueOnce({ rows: [{ clerk_id: 'test-clerk-id', email: 'test@example.com' }] });

      const response = await request(app)
        .post('/user/auth')
        .send({
          clerkId: 'test-clerk-id',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          username: 'testuser'
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should update the user if found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ clerk_id: 'test-clerk-id' }] }) // User exists
                .mockResolvedValueOnce({ rows: [{ clerk_id: 'test-clerk-id', email: 'updated@example.com' }] });

      const response = await request(app)
        .post('/user/auth')
        .send({
          clerkId: 'test-clerk-id',
          email: 'updated@example.com',
          firstName: 'Updated',
          lastName: 'User',
          username: 'updateduser'
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('updated@example.com');
    });
  });

  describe('GET /user/acct', () => {
    it('should return user data if found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ clerk_id: 'test-clerk-id', email: 'test@example.com' }] });

      const response = await request(app).get('/user/acct');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should create a new user if not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }) // User not found
                .mockResolvedValueOnce({ rows: [{ clerk_id: 'test-clerk-id', email: 'test@example.com' }] });

      const response = await request(app).get('/user/acct');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('test@example.com');
    });
  });
});
