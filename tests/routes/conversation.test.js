const conversationRouter = require('../../routes/conversation');
const express = require('express');
const request = require('supertest');
const ObjectId = require('mongoose').Types.ObjectId;
const { generateToken } = require('../../lib/jwt');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/conversations', conversationRouter);

let mockUserId = new ObjectId().toString();

const mockToken = generateToken({
  id: mockUserId,
  role: 'admin',
  username: 'karol',
});

// mock Conversation model;
const Conversation = require('../../models/conversation');
jest.mock('../../models/conversation', () => ({
  find: jest.fn(() => ({
    populate: jest.fn(() => ({
      populate: jest.fn().mockResolvedValue([
        {
          id: 1,
          participants: [{ username: 'user1', avatarUrl: 'url1' }],
          lastMessage: { content: 'Hello!', createdAt: new Date() },
        },
        {
          id: 2,
          participants: [{ username: 'user2', avatarUrl: 'url2' }],
          lastMessage: { content: 'Hi there!', createdAt: new Date() },
        },
      ]),
    })),
  })),

  findById: jest.fn().mockImplementation((id) => ({
    populate: jest.fn(() => ({
      populate: jest.fn().mockResolvedValue({
        id,
        participants: [{ _id: mockUserId, username: 'user1' }],
        messages: [
          { _id: 'msg1', text: 'Hello!', createdAt: new Date() },
          { _id: 'msg2', text: 'Hi there!', createdAt: new Date() },
        ],
      }),
    })),
  })),

  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: data.senderId,
      ...data,
      messages: [],
      save: jest.fn().mockResolvedValue({}),
    });
  }),
}));

describe('GET /conversations', () => {
  test('Should get all user specific conversations', async () => {
    const response = await request(app)
      .get('/conversations')
      .set('Authorization', `Bearer ${mockToken}`);
    expect(response.status).toBe(200);
    expect(response.body.conversations).toHaveLength(2);
  });
});

describe('POST /conversations', () => {
  test('Should create new conversation between users', async () => {
    let receiverId = new ObjectId().toString();

    const response = await request(app)
      .post('/conversations')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ receiverId: receiverId });

    expect(response.status).toBe(201);
    expect(response.body.conversation).toBeInstanceOf(Object);
    expect(response.body.conversation.participants).toHaveLength(2);
    expect(response.body.conversation.messages).toBeInstanceOf(Array);
  });

  test('Should throw 400 if both ids are identical', async () => {
    let receiverId = mockUserId;

    const response = await request(app)
      .post('/conversations')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ receiverId: receiverId });

    expect(response.status).toBe(400);
    expect(response.body.errors[0].msg).toMatch(
      /Sender and receiver cannot have same ID./i
    );
  });
});

describe('GET /conversations/:id', () => {
  test('Should get conversation details', async () => {
    let id = mockUserId;
    const response = await request(app)
      .get(`/conversations/${id}`)
      .set('authorization', `Bearer ${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.conversation.id).toMatch(id);
    expect(response.body.conversation.messages).toHaveLength(2);
    expect(response.body.conversation.messages[0].text).toEqual('Hello!');
    expect(Conversation.findById).toHaveBeenCalledWith(id);
  });
});
