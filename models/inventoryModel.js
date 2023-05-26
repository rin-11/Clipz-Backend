const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        image: {type: String, required : true},
        desc: String,
      },
      {
        timestamps: true,
      }
    );

const Inventory = mongoose.model("Inventory", InventorySchema);
module.exports = Inventory;