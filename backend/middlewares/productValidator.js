const {body} = require('express-validator');

exports.productValidationRules = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').notEmpty().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().isLength({min: 5}).withMessage('Description must be at least 10 characters long'),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('quantity').notEmpty().isInt({min: 0}).withMessage('Quantity must be a non-negative integer')
];