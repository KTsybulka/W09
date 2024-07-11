require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;
const Book = require("./models/book")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ktsybulka11:w7O2itv2hFk9i9Cz@n01561393.2mispks.mongodb.net/bookstore");// ADD YOUR CONNECTION STRING HERE, FROM LAST WEEK
let db = mongoose.connection;

// Check connection
db.once("open", ()=> {
  console.log("Connected to MongoDB");
});

// Check for DB errors
db.on("error", (err)=> {
  console.log("DB Error:" + err);
});

const book_router =require("./routs/book_router.js")
app.use("/bookstore", book_router);

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
  app
    .route("/add")
    .get((req, res) => {
      res.sendFile(path.join(__dirname, 'views/add.html'));
    })
    .post(
      [
        body("title", "Title is required").notEmpty(),
        body("author", "Author is required").notEmpty(),
        body("pages", "Pages is required").notEmpty(),
        body("ratings", "Rating is required").notEmpty(),
        body("genres", "Genre is required").notEmpty(),
      ],
      (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        let book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        book.pages = req.body.pages;
        book.genres = req.body.genres;
        book.ratings = req.body.ratings;
  
        book
          .save()
          .then(() => {
            res.json({ message: "Successfully Added" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          });
      }
    );
  
    app.route("/book/:id").get((req, res) => {
        Book.findById(req.params.id)
          .then(book => {
            if (!book) {
              return res.status(404).json({ error: 'Book not found' });
            }
            res.json({ book: book});
          })
          .catch(err => {
            console.error('Error fetching book by id:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      }).delete((req, res) => {
        const query = { _id: req.params.id };
        
        Book.deleteOne(query)
          .then(result => {
            if (result.deletedCount > 0) {
              res.json({ message: 'Successfully Deleted' });
            } else {
              res.status(404).json({ error: 'Book not found' });
            }
          })
          .catch(err => {
            console.error('Error deleting book by id:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
      });
        
  app.use((req, res) => {
    res.status(404).send("Route not found");
  });

app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));


