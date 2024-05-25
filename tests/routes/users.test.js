const users = require('../../routes/users');
const request = require('supertest');
const express = require('express');
const { generateToken } = require('../../lib/jwt');
const ObjectId = require('mongoose').Types.ObjectId;
const app = express();

const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', users);

let mockId = new ObjectId().toString();

const mockToken = generateToken({
  id: mockId,
  username: 'karol',
  role: 'admin',
});

jest.mock('../../models/user', () => {
  let users = [
    {
      id: 1,
      username: 'username',
    },
    { id: 2, username: 'username' },
    { id: 3, username: 'karol' },
  ];
  return {
    find: jest.fn().mockImplementation((query = {}) => {
      let filteredUsers = users;

      if (query.username && query.username.$regex) {
        const regex = new RegExp(query.username.$regex, 'i'); // Ignore capitalization
        filteredUsers = users.filter((user) => regex.test(user.username));
      }

      return { sort: jest.fn().mockImplementation(() => filteredUsers) };
    }),

    create: jest.fn().mockResolvedValue({
      id: 1,
      username: 'newUser',
    }),
    findById: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve([{ id, username: 'username' }])
      ),
    findByIdAndUpdate: jest.fn().mockImplementation((id, update) => {
      const existingUser = users.find((user) => user.id === parseInt(id));
      if (existingUser) {
        return Promise.resolve({
          ...users.find((user) => user.id === parseInt(id)),
          ...update,
        });
      } else {
        return Promise.resolve(null);
      }
    }),
    findByIdAndDelete: jest
      .fn()
      .mockImplementation((id) =>
        Promise.resolve({ id, username: 'some username' })
      ),
  };
});

describe('GET /users', () => {
  test('Should get list of all the users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(3);
    expect(response.body.users[0]).toHaveProperty('username');
    expect(response.body.users[1]).toHaveProperty('username');
  });

  test('Should get a user when valid ID is provided', async () => {
    let id = new ObjectId().toString();
    const response = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('username', 'username');
  });

  test('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/users/1');

    expect(response.status).toBe(401);
  });

  test('Should return 404 when invalid user ID is provided', async () => {
    const response = await request(app)
      .get('/users/999')
      .set('Authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(400);
  });
});

describe('POST /users', () => {
  test('Should create new user, and return it', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${mockToken}`)

      .send({ username: 'newUser', password: 'password12345' });

    expect(response.status).toBe(201);
  });
});

describe('PUT /users/:id', () => {
  test('Should update existing user and return it', async () => {
    const response = await request(app)
      .put(`/users/2`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        username: 'updatedUsername',
        password: 'password123',
        fullName: 'karol Pulawski',
        bio: '',
        avatarUrl: '',
        dateOfBirth: '1997-05-18',
        role: 'admin',
      });
    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('username', 'updatedUsername');
  });

  test('Should throw 400 if user not found', async () => {
    const response = await request(app)
      .put('/users/999')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        username: 'updatedUsername',
      });

    expect(response.status).toBe(400);
  });
});

describe('DELETE /users/:id', () => {
  test('Returns checks if route deletes user when id param is correct', async () => {
    const response = await request(app)
      .delete(`/users/${mockId}`)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/user deleted/i);
  });
});

describe('GET /users?q=keyword', () => {
  test('Should find user based on search query', async () => {
    const query = 'karol';
    const response = await request(app).get('/users').query({ q: query });

    expect(response.status).toBe(200);
    expect(response.body.users).toBeInstanceOf(Array);
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0].username).toBe('karol');
  });
});

describe('PUT /users/:id with file upload', () => {
  test('Should upload a file and return file details', async () => {
    const imagePath = path.join(__dirname, 'test.jpg');
    const response = await request(app)
      .put(`/users/${2}`) // Using the mockId you've defined earlier
      .set('Authorization', `Bearer ${mockToken}`) // Assuming the route requires authentication
      .attach('avatar', imagePath) // Simulating file upload
      .field('username', 'updatedUsername')
      .field('fullName', 'Karol Pulawski')
      .field('role', 'admin');

    expect(response.status).toBe(200);
    expect(response.body.fileDetails).toBeDefined();
    expect(response.body.fileDetails.originalname).toEqual('test.jpg');
    expect(response.body.user).toHaveProperty('username', 'updatedUsername');
  });
});
