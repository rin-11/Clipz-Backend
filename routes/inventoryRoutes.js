const express = require('express');
const router = express.Router();
const {  createInventory, getInventoryItem, updateInventory, deleteInventoryItem, getUserInventory } = require('../controllers/inventoryCtrl')


// createInventoryItem
router.post('/', createInventory)

// getInventoryItem
router.get('/item/:id', getInventoryItem);

// updateInventoryItem
router.put('/:id', updateInventory);

// deleteInventoryItem
router.delete('/:id', deleteInventoryItem);

// getAllInventoryItems by UserID
router.get('/user/:userId', getUserInventory);



module.exports = router;