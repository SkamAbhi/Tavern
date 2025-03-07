import request from 'supertest';
import app from '../server.js';

describe('POST /api/v1/auth/signup', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
});