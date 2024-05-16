const { body, validationResult } = require('express-validator');

const validateLogin = (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Incorrect password or username' }); // Don't send details about validation errors
  }
  return next();
};

const validate = (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: 'Validation error', errors: errors.array() });
  }
  return next();
};

const loginValidation = () => [
  body('username')
    .trim()
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage('Incorrect password or username.')
    .escape(),

  body('password')
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('Incorrect password or username.')
    .escape(),

  validateLogin,
];

const registerValidation = () => [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 5 })
    .withMessage('Username must be at least 5 characters long.')
    .escape(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long. ')
    .escape(),

  validate,
];

module.exports = {
  loginValidation,
  registerValidation,
};
