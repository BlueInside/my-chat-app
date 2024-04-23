const express = require('express');
const request = require('supertest');
const messages = require('../../routes/messages');
const ObjectId = require('mongoose').Types.ObjectId;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/messages', messages);

jest.mock('../../models/message', () => ({
  find: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue({ id: '1', text: 'Hello World' }),
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
