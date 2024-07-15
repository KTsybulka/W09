require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const Book=require("./models/book");
const app = express();
const path = require("path")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.DB_HOST);// ADD YOUR CONNECTION STRING HERE, FROM LAST WEEK
let db = mongoose.connection;

// Check connection
db.once("open", ()=> {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (err)=> {
  console.log("DB Error:" + err);
});

app.get("/", (req, res)=> {
  Book
    .find({})
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

const { body, validationResult } = require('express-validator');
const validateBook = [
  body("title", "Title is required").notEmpty(),
  body("author", "Author is required").notEmpty(),
  body("pages", "Pages is required").notEmpty(),
  body("rating", "Rating is required").notEmpty(),
  body("genres", "Genre is required").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

app
  .route("/add")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "views/add.html"));
  })
  .post(validateBook, (req, res) => {
    let book = new Book();
    book.title = req.body.title;
    book.author = req.body.author;
    book.pages = req.body.pages;
    book.genres = req.body.genres;
    book.rating = req.body.rating;

    book
      .save()
      .then(() => {
        res.json({ message: "Successfully Added" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
          
  app.use((req, res) => {
    res.status(404).send("Route not found");
  });

// app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

