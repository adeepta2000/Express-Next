const express = require('express');
const router = express.Router();
const {getAllOrders, getOrderById, createOrder, editOrder, deleteOrder} = require('../controllers/orderController');
const validate = require('../middlewares/validate');
const authenticateJWT = require('../middlewares/authMiddleware');


// GET all orders
router.get('/', authenticateJWT, getAllOrders);

// GET order by ID
router.get('/:id', authenticateJWT, getOrderById);

// POST new order
router.post('/', authenticateJWT, validate, createOrder);

// PUT update order by ID
router.put('/:id', authenticateJWT, validate, editOrder);

// DELETE order by ID
router.delete('/:id', authenticateJWT, deleteOrder);


module.exports = router;