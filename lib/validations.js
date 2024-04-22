const { body, validationResult } = require('express-validator');

const usernameValidation = body('username')
  .trim()
  .notEmpty()
  .isLength({ min: 5 })
  .withMessage('Username must be at least 5 characters long.')
  .withMessage('Username is required.')
  .escape();

const passwordValidation = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required.')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long. ')
  .escape();

const validate = (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

module.exports = {
  validateLogin: [usernameValidation, passwordValidation],
  validateSignup: [usernameValidation, passwordValidation],
  validate,
};
