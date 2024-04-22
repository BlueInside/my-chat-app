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
    const response = await request(app).post('/sign-up').send({
      username: 'newuser',
      password: 'password123',
    });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('username', 'newuser');
    expect(response.body).toHaveProperty('token');
  });
});

describe('POST /login', () => {
  test('Should authenticate user and return token', async () => {
    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should reject invalid login try', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'userNotFound', password: 'wrongPassword' });

    expect(401);
  });
});
