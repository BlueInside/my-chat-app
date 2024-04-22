const express = require('express');
const router = express.Router();
const {
  createUserValidationRules,
  updateUserValidationRules,
  validate,
} = require('../lib/userValidations');
const userController = require('../controllers/usersController');

// GET all users
router.get('/', userController.getAllUsers);

// GET single user
router.get('/:id', userController.getUserById);

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
