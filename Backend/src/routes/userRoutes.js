// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/details/:email', userController.getUserDetailsByEmail);

module.exports = router;
