const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        boardName: {type: String, required : true},
        inventoryItems: [],
        likes: [],
        keywords: [],
        collaborators: [],
        isPrivate: {type: Boolean, default: true}
      },
      {
        timestamps: true,
      }
    );

const Board = mongoose.model("Board", BoardSchema);
module.exports = Board;