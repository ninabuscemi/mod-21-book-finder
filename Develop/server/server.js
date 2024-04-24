// Import necessary dependencies
const express = require('express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas'); // GraphQL schema - typeDefs and resolvers
const { ApolloServer } = require('apollo-server-express')
const { authMiddleware } = require('./utils/auth')

// Database connection configuration
const db = require('./config/connection');
const routes = require('./routes');

const { typeDefs, resolvers } = require('./schemas');

// Initialize Express.js server
const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs, // GraphQL schema to use
  resolvers, // Resolver functions to handle GraphQL queries
  context: authMiddleware, // Middleware function to authenticate users
});

// Apply Apollo middleware to Express.js server
server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

// Applying Apollo middleware to Express.js server

server.applyMiddleware({ app });

// Express.js middleware for parsing request body

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define app routes fpr requess not handled by other routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


app.use(routes);
