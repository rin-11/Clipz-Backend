const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/userCtrl')

// ** just use for route testing **
// router.get('/', async(req, res)=>{res.send("Test User Route")}) 

// Get User by ID
router.get('/:id', getUser);

// Get all users

// Update a user

// Delete a user

// Follow a User

// Unfollow a User


module.exports = router;


