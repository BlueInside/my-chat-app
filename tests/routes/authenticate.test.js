const authenticate = require('../../routes/authenticate');
const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authenticate);

jest.mock('../../models/user', () => {
  // Require bcrypt and hash password
  const bcrypt = require('bcryptjs');
  const mockHashedPassword = bcrypt.hashSync('password123', 10);

  return {
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: mockHashedPassword,
    }),
    create: jest
      .fn()
      .mockResolvedValue({ id: 1, username: 'newuser', token: 'fakeToken' }),
  };
});

describe('POST /sign-up', () => {
  test('should register a new user', async () => {
    try {
      const response = await request(app).post('/sign-up').send({
        username: 'newuser',
        password: 'password123',
      });
      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('username', 'newuser');
      expect(response.body).toHaveProperty('token');
    } catch (error) {
      throw new Error(
        'Failed to test sign-up due to unexpected error:',
        +error
      );
    }
  });
});

describe('POST /login', () => {
  test('Should authenticate user and return token', async () => {
    try {
      const response = await request(app).post('/login').send({
        username: 'testuser',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    } catch (error) {
      throw new Error('Failed to test login due to unexpected error', +error);
    }
  });

  test('should reject invalid login try', async () => {
    try {
      const response = await request(app)
        .post('/login')
        .send({ username: 'userNotFound', password: 'wrongPassword' });

      expect(401);
    } catch (error) {
      throw new Error('Failed to test login due to unexpected error', error);
    }
  });
});
