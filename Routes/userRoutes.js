// routes/userRoutes.js
const express = require('express');
const { createUser ,getUserById } = require('../controllers/userController');

const router = express.Router();

// POST route to create a new user
router.post('/users', createUser);
router.get('/user/:id', getUserById);

module.exports = router;
