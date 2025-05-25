const Category = require('../models/Category');

//Get All Category
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    }
    catch(Error)
    {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

//Add Category
const addCategory = async (req, res) => {
    try{
        const {name, description} = req.body;

        if(!name) {
            return res.status(400).json({ message: 'Name is required. Description is Optional.' });
        }

        const newCategory = new Category({name, description});
        const savedCategory = await newCategory.save();

        res.status(201).json(savedCategory);
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error adding category', error });
    }
};

//Update Product
const updateCategory = async (req, res) => {
    try{
        const {id} = req.params;
        const {name, description} = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {name, description},
            {new: true, runValidators: true}
        );

        if(!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

//Delete Product
const deleteCategory = async (req, res) => {
    try{
        const {id} = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if(!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch(error)
    {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};


module.exports = {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
};