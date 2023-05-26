const express = require('express');
const { registerUser } = require('../controllers/userCtrl')
const router = express.Router();


// test route is working by typing http://localhost:4000/auth in browser
// **** router.get('/', async(req, res)=>{res.send("Authentication Route")}) // just used to test route *****

// register a new user http://localhost:4000/auth/register
router.post('/register', registerUser)



module.exports = router;