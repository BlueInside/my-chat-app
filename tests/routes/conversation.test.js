const conversationRouter = require('../../routes/conversation');
const express = require('express');
const request = require('supertest');
const ObjectId = require('mongoose').Types.ObjectId;
// mock Conversation model;

jest.mock('../../models/conversation', () => ({
  find: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
}));

const app = express();

app.use('/conversations', conversationRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

describe('GET /conversations', () => {
  test('Should get all user specific conversations', async () => {
    const response = await request(app).get('/conversations');

    expect(response.status).toBe(200);
    expect(response.body.conversations).toHaveLength(2);
  });
});

describe('POST /conversations', () => {
  test('Should create new conversation between users', async () => {
    let senderId = new ObjectId();
    let receiverId = new ObjectId();

    const response = await request(app)
      .post('/conversations')
      .send({ participants: [senderId, receiverId] });

    expect(response.status).toBe(201);
    expect(response.body.conversation).toBeInstanceOf(Object);
    expect(response.body.messages).toBeInstanceOf(Array);
  });
});
