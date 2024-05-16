const authenticate = require('../../routes/authenticate');
const request = require('supertest');
const express = require('express');
const { generateToken } = require('../../lib/jwt');
const ObjectId = require('mongoose').Types.ObjectId;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authenticate);

let mockId = new ObjectId().toString();
const mockToken = generateToken({
  id: mockId,
  username: 'karol',
  role: 'user',
});

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

describe('POST /register', () => {
  test('should register a new user', async () => {
    const response = await request(app).post('/register').send({
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

describe('Post /verify-token', () => {
  test('Should verify token and return user', async () => {
    const response = await request(app)
      .get('/verify-token')
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toMatch(mockId);
    expect(response.body.user).toHaveProperty('username');
    expect(response.body.user.username).toMatch(/karol/i);
    expect(response.body.user).toHaveProperty('role');
    expect(response.body.user.role).toMatch(/user/i);
  });
});
