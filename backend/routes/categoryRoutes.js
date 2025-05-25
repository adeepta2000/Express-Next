const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');


// GET all products
router.get('/', getAllCategories);

// POST new product
router.post('/', addCategory);

// PUT update product by ID
router.put('/:id', updateCategory);

// DELETE product by ID
router.delete('/:id', deleteCategory);


module.exports = router;