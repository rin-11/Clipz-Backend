const express = require('express');
const router = express.Router();
const {  createInventory, getInventory, updateInventory, deleteInventory, getUserInventory } = require('../controllers/inventoryCtrl')


// createInventoryItem
router.post('/', createInventory)

// getInventoryItem
router.get('/:id', getInventory);

// updateInventoryItem
router.put('/:id', updateInventory);

// deleteInventoryItem
router.delete('/:id', deleteInventory);

//getAllInventoryItems by UserID
router.get('/:id/inventory', getUserInventory)



module.exports = router;