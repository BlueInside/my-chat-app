const express = require('express');
const request = require('supertest');
const messages = require('../../routes/messages');
const ObjectId = require('mongoose').Types.ObjectId;

const { generateToken } = require('../../lib/jwt');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/messages', messages);

let mockId = new ObjectId().toString();
const mockToken = generateToken({
  id: mockId,
  username: 'karol',
  role: 'user',
});

// Mock conversation model
jest.mock('../../models/conversation', () => ({
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    messages: [],
    lastMessage: '',
    save: jest.fn().mockResolvedValue({}),
  }),
  updateMany: jest.fn().mockResolvedValue({ message: 'success' }),
}));

// Mock messages model
jest.mock('../../models/message', () => ({
  find: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockImplementation((id) =>
    Promise.resolve({
      id,
      sender: {
        toString: () => id,
      },
      text: 'Hello World',
    })
  ),
  create: jest.fn().mockImplementation((data) =>
    Promise.resolve({
      id: data.sender,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  ),
  findByIdAndDelete: jest.fn().mockResolvedValue({ id: '2' }),
}));

describe('GET /messages', () => {
  test('Get single message by id', async () => {
    const id = new ObjectId();
    const response = await request(app)
      .get(`/messages/${id}`)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBeInstanceOf(Object);
    expect(response.body.message.text).toBe('Hello World');
  });
});

describe('POST /messages', () => {
  test('Should send message', async () => {
    const data = {
      receiverId: new ObjectId().toString(),
      text: 'Hello world',
    };

    const response = await request(app)
      .post('/messages')
      .send(data)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(201);
    expect(response.body.data.text).toBe(data.text);
    expect(response.body.data.receiver).toBe(data.receiverId);
    expect(response.body.data.sender).toBe(mockId);
  });
});

describe('DELETE /messages/:id', () => {
  test('Should delete message by id', async () => {
    const response = await request(app)
      .delete(`/messages/${mockId}`)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(
      `Message ${mockId} successfully deleted`
    );
    expect(response.body.data).toBeInstanceOf(Object);
  });

  test('Should throw 400 if id is in wrong format', async () => {
    const id = 'wrong format id';
    const response = await request(app)
      .delete(`/messages/${id}`)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toMatch(`Invalid id format.`);
  });
});
