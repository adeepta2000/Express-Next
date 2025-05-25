const Product = require('../models/Product')

//Get All Product
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId');
        res.status(200).json(products);
    }
    catch(Error)
    {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

//Get Product By Id
const getProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id).populate('categoryId');

        if(!product) {
            res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    }
    catch(err){
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ message: 'Error fetching product', error: err });
    }
};

//Add Product
const addProduct = async (req, res) => {
    try{
        const {name, description, price, quantity, categoryId} = req.body;

        if(!name || !price || !quantity || !categoryId) {
            return res.status(400).json({ message: 'All fields are required. Description is Optional.' });
        }

        const newProduct = new Product({name, description, price, quantity, categoryId});
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error adding product', error });
    }
};

//Update Product
const updateProduct = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, description, price, quantity, categoryId} = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {name, description, price, quantity, categoryId},
            {new: true, runValidators: true}
        );

        if(!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

//Delete Product
const deleteProduct = async (req, res) => {
    try{
        const {id} = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};