const mongoose = require('mongoose');
const {BaseEntitySchema} = require('../models/BaseEnity');


const ProductSchema = new mongoose.Schema({
    ...BaseEntitySchema.obj,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, { timestamps: true });


module.exports = mongoose.model('Product', ProductSchema);