const express = require('express');
const router = express.Router();
const { createBoard, getBoard, getAllBoards, updateBoard, deleteBoard, interactBoard, getUserBoards, getHomepageBoards } = require('../controllers/boardCtrl')


// Create Board
router.post('/', createBoard)

// Get Board by ID 
    // (for home page when no user logged in)
router.get('/:id', getBoard);

// Get all Boards
router.get('/', getAllBoards);

// Get all Boards by User ID
    // (for user profile page when user logged in)
router.get('/:id/profile', getUserBoards)

// Get Homepage Boards by User ID and Followers[]
    // // (for home page when user logged in)
router.get('/:id/home', getHomepageBoards)

// Update Board by ID
router.put('/:id', updateBoard);

// Delete Board by ID
router.delete('/:id', deleteBoard);

// Like/Dislike Board by ID
router.put('/:id/interact', interactBoard);



module.exports = router;