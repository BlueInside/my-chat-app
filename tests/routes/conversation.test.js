const conversationRouter = require('../../routes/conversation');
const express = require('express');
const request = require('supertest');

const app = express();

app.use('/conversations', conversationRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
