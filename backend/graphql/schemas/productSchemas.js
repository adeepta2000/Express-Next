const { gql } = require('apollo-server-express');


const productTypeDefs = gql`
    type Product {
        id: ID!
        name: String!
        description: String
        price: Float!
        quantity: Int!
        categoryId: ID!
        category: Category
        createdAt: String
        updatedAt: String
    }

    type Category {
        id: ID!
        name: String!
        description: String
        createdAt: String
        updatedAt: String
    }

    input ProductInput {
        name: String!
        description: String
        price: Float!
        quantity: Int!
        categoryId: ID!
    }

    input ProductUpdateInput {
        name: String
        description: String
        price: Float
        quantity: Int
        categoryId: ID
    }

    type Query {
        products(
        limit: Int = 10
        offset: Int = 0
        categoryId: ID
        minPrice: Float
        maxPrice: Float
        ): [Product!]!

        product(id: ID!): Product

        productsCount(categoryId: ID): Int!
    }

    type Mutation {
        addProduct(input: ProductInput!): Product!
        updateProduct(id: ID!, input: ProductUpdateInput!): Product!
        deleteProduct(id: ID!): Boolean!
    }

    type Subscription {
        productAdded: Product!
        productUpdated: Product!
        productDeleted: ID!
    }
`;


module.exports = productTypeDefs;