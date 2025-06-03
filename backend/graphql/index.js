const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const productTypeDefs = require('./schemas/productSchema');
const productResolvers = require('./resolvers/productResolvers');
const createLoaders = require('./dataloaders');

// JWT verification function (similar to your authMiddleware)
const verifyToken = (token) => {
  try {
    if (!token) return null;
    
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');
    
    return jwt.verify(cleanToken, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Create Apollo Server
const createGraphQLServer = () => {
  return new ApolloServer({
    typeDefs: [productTypeDefs], // Add more schemas here as array
    resolvers: [productResolvers], // Add more resolvers here as array
    
    // Context function - runs for every request
    context: ({ req, connection }) => {
      // For subscriptions (WebSocket connections)
      if (connection) {
        return {
          ...connection.context,
          loaders: createLoaders()
        };
      }

      // For queries and mutations (HTTP requests)
      const token = req.headers.authorization;
      const user = verifyToken(token);

      return {
        user, // Authenticated user info
        loaders: createLoaders(), // Fresh DataLoaders for each request
        req // Express request object if needed
      };
    },

    // Subscription context for WebSocket
    subscriptions: {
      onConnect: (connectionParams) => {
        const token = connectionParams.authorization;
        const user = verifyToken(token);
        
        return {
          user,
          loaders: createLoaders()
        };
      }
    },

    // Development settings
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',

    // Error formatting
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Don't expose internal errors in production
      if (process.env.NODE_ENV === 'production') {
        return new Error('Internal server error');
      }
      
      return error;
    },

    // Performance and security settings
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 20
    }
  });
};

module.exports = createGraphQLServer;