const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');


//Gett all orders
const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({isRemove: 0}).populate('userId').sort({orderDate: -1});
        
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const orderItems = await OrderItem.find({orderId: order._id}).populate('productId');
            return {
                ...order.toObject(),
                orderItems
            };
        }));

        res.status(200).json(ordersWithItems);
    }
    catch(error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

//Get order by ID
const getOrderById = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id).populate('userId');

        if(!order) {
            res.status(404).json({ message: 'Order not found' });
        }

        const orderItems = await OrderItem.find({ orderId: order._id }).populate('productId');
        res.status(200).json({ 
            order: {
                ...order.toObject(),
                orderItems
            } 
        });
    }
    catch(error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Error fetching order', error });
    }
};


//Create new order
const createOrder = async (req, res) => {
    try{
        const {items} = req.body;
        const userId = req.user.id;

        if(!items || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        const newOrder = new Order({
            userId,
            totalAmount
        });

        const savedOrder = await newOrder.save();

        const orderItemsData = items.map(item => ({
            orderId: savedOrder._id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }));

        await OrderItem.insertMany(orderItemsData);

        res.status(201).json({
            message: 'Order created successfully',
            orderId: savedOrder._id
        });

        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    catch(error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};


//Edit order
const editOrder = async (req, res) => {
    try{
        const {items} = req.body;
        const orderId = req.params.id;

        if(!items || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

        await Order.findByIdAndUpdate(orderId,{
            totalAmount
        });

        await OrderItem.deleteMany({ orderId });

        const orderItemsData = items.map(item => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }));

        await OrderItem.insertMany(orderItemsData);

        res.status(200).json({ message: 'Order updated successfully' });
    }
    catch(error) {
        console.error('Error editing order:', error);
        res.status(500).json({ message: 'Error editing order', error });
    }
};


//Delete order
const deleteOrder = async (req, res) => {
    try{
        const orderId = req.params.id;

        await Order.findByIdAndUpdate(orderId, { isRemove: 1 });

        res.status(200).json({ message: 'Order deleted successfully' });
    }
    catch(error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order', error });
    }
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    editOrder,
    deleteOrder
};