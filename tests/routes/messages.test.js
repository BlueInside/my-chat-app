const express = require('express');
const request = require('supertest');
const messages = require('../../routes/messages');
const ObjectId = require('mongoose').Types.ObjectId;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/messages', messages);

// Mock conversation model
jest.mock('../../models/conversation', () => ({
  findOne: jest.fn().mockResolvedValue({
    id: '1',
    messages: [],
    lastMessage: '',
    save: jest.fn().mockResolvedValue({}),
  }),
}));

// Mock messages model
jest.mock('../../models/message', () => ({
  find: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue({ id: '1', text: 'Hello World' }),
  create: jest.fn().mockImplementation((data) =>
    Promise.resolve({
      id: data.sender,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  ),
}));

describe('GET /messages', () => {
  test('Get all messages', async () => {
    const response = await request(app).get('/messages');

    expect(response.status).toBe(200);
    expect(response.body.messages).toBeInstanceOf(Array);
  });

  test('Get single message by id', async () => {
    const id = new ObjectId();
    const response = await request(app).get(`/messages/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBeInstanceOf(Object);
    expect(response.body.message.text).toBe('Hello World');
  });
});

describe('POST /messages', () => {
  test('Successfully sends message', async () => {
    const data = {
      receiverId: new ObjectId().toString(),
      senderId: new ObjectId().toString(),
      text: 'Hello world',
    };

    const response = await request(app).post('/messages').send(data);

    expect(response.status).toBe(201);
    expect(response.body.data.text).toBe(data.text);
    expect(response.body.data.receiver).toBe(data.receiverId);
    expect(response.body.data.sender).toBe(data.senderId);
  });
});
