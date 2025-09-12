const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
require('./db'); // Connect to MongoDB
const apiRouter = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize express app
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/v1", apiRouter);

// Start Server
const server = app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
