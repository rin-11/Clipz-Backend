const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        image: {type: String, required : true},
        likes: [],
        collaborators: []
      },
      {
        timestamps: true,
      }
    );

const Board = mongoose.model("Board", BoardSchema);
module.exports = Board;