const express = require("express");
const router = express.Router();
const path = require("path");
const Book = require("../models/book");
const validateBook = require("../middleware/validation");

// Get all books
router.get("/api/books", (req, res) => {
  Book.find({})
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Serve books HTML page
router.get('/books', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'books.html'));
});

// Add a new book
router
  .route("/book/add")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../views/add.html"));
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

// Get a book by ID
router
  .route("/api/book/:id")
  .get((req, res) => {
    Book.findById(req.params.id)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }
        res.json(book);  // Simplified to res.json(book)
      })
      .catch((err) => {
        console.error("Error fetching book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });

// Serve edit book HTML page
router.get('/book/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "edit-book.html"));
});

// Update a book by ID
router
  .route("/api/book/edit/:id")
  .get((req, res) => {
    Book.findById(req.params.id)
      .then((book) => {
        if (!book) {
          return res.status(404).json({ error: "Book not found" });
        }
        res.json(book);  // Simplified to res.json(book)
      })
      .catch((err) => {
        console.error("Error fetching book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  })
  .post((req, res) => {
    let updatedBook = {
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      genres: req.body.genres,
      rating: req.body.rating,
    };

    const query = { _id: req.params.id };

    Book.updateOne(query, updatedBook)
      .then(() => {
        res.json({ message: "Successfully Updated" });
      })
      .catch((err) => {
        console.error("Error updating book by id:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });

// Delete a book by ID
router.delete("/api/book/:id", (req, res) => {
  const query = { _id: req.params.id };

  Book.deleteOne(query)
    .then((result) => {
      if (result.deletedCount > 0) {
        res.json({ message: "Successfully Deleted" });
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    })
    .catch((err) => {
      console.error("Error deleting book by id:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;

