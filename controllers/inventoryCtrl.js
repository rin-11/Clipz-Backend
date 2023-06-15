const Inventory = require('../models/inventoryModel')
const Board = require('../models/boardModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// create Inventory Item
exports.createInventory = async (req, res) => {
    
    const newInventory = new Inventory(req.body); 
  
    try {
      // save new Inventory to the DB
      await newInventory.save(); 
      res.status(200).json(newInventory);
    } catch (error) { 
      res.status(500).json(error);
    }
  };

  // get Inventory by ID
exports.getInventoryItem = async (req, res) => {
    // extract the id param from the request params (req.params)
    const id = req.params.id;
  
    try {
      const inventory = await Inventory.findById(id);
      // if inventory is found by ID return inventory JSON information
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  // Update Inventory by ID
  exports.updateInventory = async (req, res) => {
  
    const inventoryId = req.params.id; // extract the id param from the req URL and assign it to the inventoryId variable
    const { userId } = req.body; //extract the userId property from the request body and assign it to the userId variable
  
    try {
      const inventory = await Inventory.findById(inventoryId);
      if (inventory.userId === userId) { //  if the userId of the retrieved inventory matches the userId provided in the req body
      await inventory.updateOne({ $set: req.body }); // use the updateOne method to update the inventory with the data from the req body -- $set operator sets the fields of the inventory to the values in the req body
      res.status(200).json("Inventory Updated");
      } else {
        res.status(403).json("Access Denied");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

// Delete Inventory by ID
exports.deleteInventoryItem = async (req, res) => {
    const id = req.params.id;  // extract the id param from the req URL and assign it to the id variable
    const { userId } = req.body; // extract the userId property from the req body and assign it to the userId variable
  
    try {
      const inventory = await Inventory.findById(id); // find a inventory with the specified id & assign to the inventory variable
      if (inventory.userId === userId) { // check if the userId of the retrieved inventory matches the userId provided in the req body
        await inventory.deleteOne(); // if true -- delete the retrieved inventory from DB
        res.status(200).json("Inventory Deleted");
      } else { // cannot delete inventory if not the user's board
        res.status(403).json("Access Denied");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  };

// Get all Inventory by User ID
exports.getUserInventory = async (req, res) => {
  try {
      const userId = req.params.userId;  
      console.log("Requested User Id: ", userId); 
      const userInventory = await Inventory.find({userId: userId});  
      console.log("Inventory Items: ", userInventory); 
      res.status(200).json(userInventory); 
  } catch (err) {
      res.status(500).json(err);
  }
}
