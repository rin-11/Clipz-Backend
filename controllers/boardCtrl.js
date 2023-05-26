const Board = require('../models/boardModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');


// create Board
exports.createBoard = async (req, res) => {
    
  const newBoard = new Board(req.body); // new board instance is created using new BoardModel with the request body as the data

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
  
    const boardId = req.params.id; // extract the id param from the req URL and assign it to the boardId variable
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
      const board = await Board.findById(id); // find a board with the specified id & assign to the board variable
      if (board.userId === userId) { // check if the userId of the retrieved board matches the userId provided in the req body
        await board.deleteOne(); // if true -- delete the retrieved board from DB
        res.status(200).json("Board Deleted");
      } else { // cannot delete board if not the user's board
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

// Get all Boards by User ID
exports.getUserBoards = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserBoards = await Board.find({ userId: userId });

    res.status(200).json(currentUserBoards.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }));
  } catch (error) {
    res.status(500).json(error);
  }
};


// Get Homepage Boards by User ID and Followers[]
exports.getHomepageBoards = async (req, res) => {
  const userId = req.params.id; // extract the id param from the req URL and assign it to the id variable
  try {
    const currentUserBoards = await Board.find({ userId: userId }); // query the db to find all the boards where the userId matches the userId variable

    
    const followingBoards = await User.aggregate([ // perform an aggregation query on the UserModel collection
      {
        $match: { // match the _id field of the user document with the specified userId
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: { // lookup the boards from the "boards" collection where the userId matches the following field of the user
          from: "boards",
          localField: "following",
          foreignField: "userId",
          as: "followingBoards",
        },
      },
      {
        $project: {
          followingBoards: 1,
          _id: 0,
        }, // project only the followingBoards field while excluding the _id field
      },
    ]);

    res.status(200).json(
      currentUserBoards
      // concatenate the currentUserBoards array with the followingBoards[0].followingBoards array (extracting the followingBoards array from the first element of followingBoards)
        .concat(...followingBoards[0].followingBoards)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }) // sort the combined array based on the createdAt property in descending order
    );
  } catch (error) {
    res.status(500).json(error);
  }
};