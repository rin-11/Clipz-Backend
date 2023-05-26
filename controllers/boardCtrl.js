const Board = require('../models/boardModel');


// create Board
exports.createBoard = async (req, res) => {
    
  const newBoard = new Board(req.body); // new board instance is created using new PostModel with the request body as the data

  try {
    // save new board to the DB
    await newBoard.save(); 
    res.status(200).json(newBoard);
  } catch (error) { 
    res.status(500).json(error);
  }
};