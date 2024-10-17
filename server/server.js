require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConnection = require("./Database/dbConnection");
const router = require("./Routes/problemRoutes");
const authRouter = require("./Routes/authRouter");
// const problemRoutes = require('./routes/problemRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/problems', problemRoutes);

// Connect to MongoDB

dbConnection();
app.use("/api/", router);
app.use("/api/auth", authRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
