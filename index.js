require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DB_HOST);
let db = mongoose.connection;

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (err) => {
  console.log("DB Error:" + err);
});

// Use book router for routes starting with /book
const bookRouter = require("./routes/book_router");
app.use("/", bookRouter);

// 404 Route
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start server
app.listen(PORT, () =>
  console.log(`Server started on http://127.0.0.1:${PORT}`)
);