const express = require('express');
const request = require('supertest');
const messagesRouter = require('../../routes/messages');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/messages', messagesRouter);

describe('GET messages from /messages', () => {
  it('Should get all messages', async () => {
    const response = await request(app).get('/messages');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
