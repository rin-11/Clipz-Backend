const express = require('express');
const { registerUser, loginUser } = require('../controllers/authCtrl')
const router = express.Router();


// test route is working by typing http://localhost:4000/auth in browser
// **** router.get('/', async(req, res)=>{res.send("Authentication Route")}) // just used to test route *****

// register a new user http://localhost:4000/auth/register
router.post('/register', registerUser)

// login user http://localhost:4000/auth/login
router.post('/login', loginUser)

module.exports = router;