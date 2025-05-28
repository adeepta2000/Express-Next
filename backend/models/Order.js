const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    isRemove: {
        type: Number,
        default: 0
    }
}, {timestamps: true});


module.exports = mongoose.model('Order', OrderSchema);