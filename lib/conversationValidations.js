const isValid = require('mongoose').Types.ObjectId.isValid;
const { body, param, validationResult } = require('express-validator');

const isMongoId = (value, { req }) => {
  if (!isValid(value)) {
    throw new Error('Invalid id string');
  }
  return true;
};

const isNotSameId = (value, { req }) => {
  if (req.user.id === value) {
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
  body('receiverId')
    .trim()
    .custom(isMongoId)
    .withMessage('Receiver ID must be a valid MongoDB ObjectId')
    .custom(isNotSameId)
    .withMessage('Sender and receiver cannot have same ID.'),

  validate,
];

const conversationDetailsValidation = () => [
  param('id')
    .trim()
    .escape()
    .custom(isMongoId)
    .withMessage('Invalid id format.'),

  validate,
];
module.exports = {
  createConversationValidation,
  conversationDetailsValidation,
};
