const express = require('express');
const router = express.Router();

const { searchUsers } = require('../controllers/searchCtrl')

// Search users
router.post('/:search', searchUsers);

module.exports = router;