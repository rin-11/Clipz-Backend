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

// get Board by ID
exports.getBoard = async (req, res) => {
    // extract the id param from the request params (req.params)
    const id = req.params.id;
  
    try {
      const board = await Board.findById(id);
      // if board is found by ID return board JSON information
      res.status(200).json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  };


  // Get ALL Boards
  exports.getAllBoards = async (req, res) => {

    try {
      let boards = await Board.find();
      boards = boards.map((board)=>{ // use the map function to iterate over each board in the boards array found in mongoDB boards
      return boards
      });
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // Update Board
  exports.updateBoard = async (req, res) => {
  
    const boardId = req.params.id; // extract the id param from the req URL and assign it to the postId variable
    const { userId } = req.body; //extract the userId property from the request body and assign it to the userId variable
  
    try {
      const board = await Board.findById(boardId);
      if (board.userId === userId) { //  if the userId of the retrieved board matches the userId provided in the req body
      await board.updateOne({ $set: req.body }); // use the updateOne method to update the board with the data from the req body -- $set operator sets the fields of the board to the values in the req body
      res.status(200).json("Board Updated");
      } else {
        res.status(403).json("Access Denied");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

// Delete Board by ID
exports.deleteBoard = async (req, res) => {
    const id = req.params.id;  // extract the id param from the req URL and assign it to the id variable
    const { userId } = req.body; // extract the userId property from the req body and assign it to the userId variable
  
    try {
      const board = await Board.findById(id); // find a board with the specified id & assign to the post variable
      if (board.userId === userId) { // check if the userId of the retrieved board matches the userId provided in the req body
        await board.deleteOne(); // if true -- delete the retrieved board from DB
        res.status(200).json("Board Deleted");
      } else { // cannot delete board if not the user's post
        res.status(403).json("Access Denied");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // Like/Dislike Board by ID
exports.interactBoard = async (req, res) => {
  const id = req.params.id;// extract the id param from the req URL and assign it to the id variable
  const { userId } = req.body; // extract the userId property from the req body and assign it to the userId variable

  try {
    const board = await Board.findById(id); // find a board with the specified id & assign to the board variable
    if (board.likes.includes(userId)) { // check if the likes array of the retrieved board includes the userId provided in the req body
      await board.updateOne({ $pull: { likes: userId } }); // remove the userId from the likes array using the $pull operator if already liked
      res.status(200).json("Board Disliked");
    } else {
      await board.updateOne({ $push: { likes: userId } }); // add the userId to the likes array using the $push operator if userId not found in likes array
      res.status(200).json("Board Liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};