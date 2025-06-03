const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {productValidationRules} = require('../middlewares/productValidator');
const validate = require('../middlewares/validate');
const authenticateJWT = require('../middlewares/authMiddleware');


// GET all products
router.get('/', getAllProducts);

//Get product by ID
router.get('/:id', authenticateJWT, getProductById);

// POST new product
router.post('/', authenticateJWT, productValidationRules, validate, addProduct);

// PUT update product by ID
router.put('/:id', authenticateJWT, productValidationRules, validate, updateProduct);

// DELETE product by ID
router.delete('/:id', authenticateJWT, deleteProduct);


module.exports = router;