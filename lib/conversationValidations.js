const isValid = require('mongoose').Types.ObjectId.isValid;
const { body, validationResult } = require('express-validator');

const isMongoId = (value, { req }) => {
  if (!isValid(value)) {
    throw new Error('Invalid id string');
  }
  return true;
};

const isNotSameId = (value, { req }) => {
  if (value === req.body.receiverId) {
    throw new Error('Sender and receiver cannot be the same.');
  }
  return true;
};

const validate = (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createConversationValidation = () => [
  body('senderId')
    .trim()
    .custom(isMongoId)
    .withMessage('Sender ID must be a valid MongoDB ObjectId')
    .custom(isNotSameId)
    .withMessage('Sender and receiver cannot be the same.'),

  body('receiverId')
    .trim()
    .custom(isMongoId)
    .withMessage('Receiver ID must be a valid MongoDB ObjectId'),

  validate,
];

module.exports = { createConversationValidation };
