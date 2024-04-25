const conversationRouter = require('../../routes/conversation');
const express = require('express');
const request = require('supertest');
const ObjectId = require('mongoose').Types.ObjectId;
// mock Conversation model;

jest.mock('../../models/conversation', () => ({
  find: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: data.senderId,
      ...data,
      messages: [],
      save: jest.fn().mockResolvedValue({}),
    });
  }),
}));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/conversations', conversationRouter);

describe('GET /conversations', () => {
  test('Should get all user specific conversations', async () => {
    const response = await request(app).get('/conversations');

    expect(response.status).toBe(200);
    expect(response.body.conversations).toHaveLength(2);
  });
});

describe('POST /conversations', () => {
  test('Should create new conversation between users', async () => {
    let senderId = new ObjectId().toString();
    let receiverId = new ObjectId().toString();

    const response = await request(app)
      .post('/conversations')
      .send({ senderId: senderId, receiverId: receiverId });

    expect(response.status).toBe(201);
    expect(response.body.conversation).toBeInstanceOf(Object);
    expect(response.body.conversation.participants).toHaveLength(2);
    expect(response.body.conversation.messages).toBeInstanceOf(Array);
  });

  test('Should throw 400 if both ids are identical', async () => {
    let senderId = new ObjectId().toString();
    let receiverId = senderId;

    const response = await request(app)
      .post('/conversations')
      .send({ senderId: senderId, receiverId: receiverId });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(
      /Sender and receiver cannot be the same./i
    );
  });
});
