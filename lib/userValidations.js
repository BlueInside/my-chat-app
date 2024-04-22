const { body, validationResult } = require('express-validator');

const usernameValidation = body('username')
  .trim()
  .notEmpty()
  .withMessage('Username is required.')
  .isLength({ min: 5 })
  .withMessage('Username must be at least 5 characters long.')
  .escape();

const passwordValidation = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required.')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long. ')
  .escape();

const fullNameValidation = body('fullName').trim();

const bioValidation = body('bio').trim();

const avatarUrlValidation = body('avatarUrl').trim().escape();

const dateOfBirthValidation = body('dateOfBirth')
  .isDate()
  .withMessage('It must be correct date format');

const roleValidation = body('role')
  .isIn(['user', 'admin'])
  .withMessage('Invalid role');

const createUserValidationRules = () => [
  usernameValidation,
  passwordValidation,
];

const updateUserValidationRules = () => [
  passwordValidation,
  fullNameValidation,
  bioValidation,
  avatarUrlValidation,
  dateOfBirthValidation,
  roleValidation,
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
};

module.exports = {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
};
