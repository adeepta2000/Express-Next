const DataLoader = require('dataloader');
const Category = require('../../models/Category');
const Product = require('../../models/Product');


const createCategoryLoader = () => {
    return new DataLoader(async (categoryIds) => {
        try{
            const categroies = await Category.find({ _id: { $in: categoryIds } }).lean();

            const categoryMap = new Map();
            categroies.forEach(category => {
                categoryMap.set(category._id.toString(), category);
            });

            return categoryIds.map(id => categoryMap.get(id.toString()) || null);
        }
        catch (error) {
            console.error('Error loading categories:', error);
            return categoryIds.map(() => null); // Return null for any IDs that fail to load
        }
    });
};

const createProductLoader = () => {
    return new DataLoader(async (productIds) => {
        try{
            const products = await Product.find({ _id: { $in: productIds } }).lean();
            const productMap = new Map();
            products.forEach(product => {
                productMap.set(product._id.toString(), product);
            });

            return productIds.map(id => productMap.get(id.toString()) || null);
        }
        catch (error) {
            console.error('Error loading products:', error);
            return productIds.map(() => null); // Return null for any IDs that fail to load
        }
    });
};


const createLoaders = () => ({
    categoryLoader: createCategoryLoader(),
    productLoader: createProductLoader()
});


module.exports = createLoaders;