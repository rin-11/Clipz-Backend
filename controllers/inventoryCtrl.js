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
  const inventoryId = req.params.id;
  const { name, category } = req.body;

  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      { name, category },
      { new: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Inventory by ID
exports.deleteInventoryItem = async (req, res) => {
  const id = req.params.id;

  try {
    await Inventory.findByIdAndDelete(id);
    res.status(200).json('Inventory Item Deleted');
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
