const express = require('express');
const router = express.Router();

const { searchUsers, getUserProfile } = require('../controllers/searchCtrl');

// Search users by ID
router.get('/:search', searchUsers);

// Get user profile
router.get('/profile/:id', getUserProfile);

module.exports = router;
