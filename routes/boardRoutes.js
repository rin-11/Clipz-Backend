const express = require('express');
const router = express.Router();
const { createBoard } = require('../controllers/boardCtrl')

// ** test ** 
// router.get('/', async(req, res)=>{res.send("Boards Route Working")}) 

// createBoard
router.post('/', createBoard)

// deleteBoard

// getBoard

// likeBoard

// updateBoard




module.exports = router;