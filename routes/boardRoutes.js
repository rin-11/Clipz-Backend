const express = require('express');
const router = express.Router();
const { createBoard, getBoard, getAllBoards } = require('../controllers/boardCtrl')

// ** test ** 
// router.get('/', async(req, res)=>{res.send("Boards Route Working")}) 

// Create Board
router.post('/', createBoard)

// Get Board by ID
router.get('/:id', getBoard);

// Get all Boards
router.get('/', getAllBoards);

// deleteBoard


// likeBoard

// updateBoard




module.exports = router;