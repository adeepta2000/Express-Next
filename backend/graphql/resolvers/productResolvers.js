const Product = require('../../models/Product');
const { PubSub } = require('graphql-subscriptions');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

const pubsub = new PubSub();


const PRODUCT_ADDED = 'PRODUCT_ADDED';
const PRODUCT_UPDATED = 'PRODUCT_UPDATED';
const PRODUCT_DELETED = 'PRODUCT_DELETED';


const productResolvers = {
    Query: {
        products: async (_, { limit = 10, offset = 0, categoryId, minPrice, maxPrice }, { user }) => {
            try{
                if (!user) {
                    throw new AuthenticationError('You must be logged in');
                }

                const filter = {};
                if(categoryId) filter.categoryId = categoryId;
                if(minPrice !== undefined || maxPrice !== undefined) {
                    filter.price = {};
                    if(minPrice !== undefined) filter.price.$gte = minPrice;
                    if(maxPrice !== undefined) filter.price.$lte = maxPrice;
                }

                const products = await Product.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit)
                    .lean();

                return products;
            }
            catch (error) {
                console.error('Error fetching products:', error);
                throw error;
            }
        },

        product: async (_, { id }, { user }) => {
            try{
                if (!user) {
                    throw new AuthenticationError('You must be logged in');
                }

                const product = await Product.findById(id).lean();

                if (!product) {
                    throw new UserInputError('Product not found');
                }

                return product;
            }
            catch (error) {
                console.error('Error fetching product:', error);
                throw error;
            }
        },

        productsCount: async (_, { categoryId }, { user }) => {
            try {
                if (!user) {
                throw new AuthenticationError('You must be logged in');
                }

                const filter = categoryId ? { categoryId } : {};
                return await Product.countDocuments(filter);
            } catch (error) {
                console.error('Error counting products:', error);
                throw error;
            }
        }
    },

    Mutation: {
    // Add new product
    addProduct: async (_, { input }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('You must be logged in');
        }

        const { name, description, price, quantity, categoryId } = input;

        // Validation (similar to your middleware)
        if (!name || !price || !quantity || !categoryId) {
          throw new UserInputError('All required fields must be provided');
        }

        if (price <= 0) {
          throw new UserInputError('Price must be greater than 0');
        }

        if (quantity < 0) {
          throw new UserInputError('Quantity cannot be negative');
        }

        const newProduct = new Product({
          name,
          description,
          price,
          quantity,
          categoryId
        });

        const savedProduct = await newProduct.save();
        
        // Publish subscription event
        pubsub.publish(PRODUCT_ADDED, { productAdded: savedProduct });

        return savedProduct;
      } catch (error) {
        console.error('Error adding product:', error);
        throw error;
      }
    },

    // Update existing product
    updateProduct: async (_, { id, input }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('You must be logged in');
        }

        // Validate input
        if (input.price !== undefined && input.price <= 0) {
          throw new UserInputError('Price must be greater than 0');
        }

        if (input.quantity !== undefined && input.quantity < 0) {
          throw new UserInputError('Quantity cannot be negative');
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          input,
          { new: true, runValidators: true }
        );

        if (!updatedProduct) {
          throw new UserInputError('Product not found');
        }

        // Publish subscription event
        pubsub.publish(PRODUCT_UPDATED, { productUpdated: updatedProduct });

        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },

    // Delete product
    deleteProduct: async (_, { id }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('You must be logged in');
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          throw new UserInputError('Product not found');
        }

        // Publish subscription event
        pubsub.publish(PRODUCT_DELETED, { productDeleted: id });

        return true;
      } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    }
  },

  Subscription: {
    productAdded: {
      subscribe: () => pubsub.asyncIterator([PRODUCT_ADDED])
    },
    productUpdated: {
      subscribe: () => pubsub.asyncIterator([PRODUCT_UPDATED])
    },
    productDeleted: {
      subscribe: () => pubsub.asyncIterator([PRODUCT_DELETED])
    }
  },

  // Field resolvers - this is where DataLoader shines
  Product: {
    // Resolve category field using DataLoader
    category: async (parent, _, { loaders }) => {
      if (!parent.categoryId) return null;
      
      try {
        return await loaders.categoryLoader.load(parent.categoryId);
      } catch (error) {
        console.error('Error loading category:', error);
        return null;
      }
    },

    // Format dates if needed
    createdAt: (parent) => parent.createdAt?.toISOString(),
    updatedAt: (parent) => parent.updatedAt?.toISOString()
  }
};


module.exports = productResolvers;