const express = require('express');
const router = express.Router();
const {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
  getAllUsersValidation,
  getUserByIdValidation,
} = require('../lib/userValidations');
const { authenticateToken } = require('../lib/jwt');
const userController = require('../controllers/usersController');

// GET all users
router.get('/', getAllUsersValidation(), userController.getAllUsers);

// GET single user
router.get(
  '/:id',
  authenticateToken,
  getUserByIdValidation(),
  userController.getUserById
);

// POST new user
router.post(
  '/',
  createUserValidationRules(),
  validate,
  userController.createUser
);

// PUT to edit existing user
router.put(
  '/:id',
  updateUserValidationRules(),
  validate,
  userController.updateUser
);

// DELETE to remove existing user
router.delete('/:id', userController.deleteUser);

module.exports = router;
