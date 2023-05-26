const express = require('express');
const router = express.Router();
const { createBoard, getBoard, getAllBoards, updateBoard } = require('../controllers/boardCtrl')

// ** test ** 
// router.get('/', async(req, res)=>{res.send("Boards Route Working")}) 

// Create Board
router.post('/', createBoard)

// Get Board by ID
router.get('/:id', getBoard);

// Get all Boards
router.get('/', getAllBoards);

// Update Board by ID
router.put('/:id', updateBoard);

// Delete Board by ID

// Like Board by ID




module.exports = router;