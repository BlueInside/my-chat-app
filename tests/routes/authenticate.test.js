const authenticate = require('../../routes/authenticate');
const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authenticate);

jest.mock('../../models/user', () => ({
  findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  create: jest
    .fn()
    .mockResolvedValue({ id: 1, username: 'newuser', token: 'fakeToken' }),
}));

describe('POST /sign-up', () => {
  test('should register a new user', (done) => {
    request(app)
      .post('/sign-up')
      .send({
        username: 'newuser',
        password: 'password123',
      })
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('username', 'newuser');
        expect(response.body).toHaveProperty('token');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
