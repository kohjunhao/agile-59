const express = require("express");
const router = express.Router();

// fetch draft event and published article
router.get("/", (req, res) => {
  const queryDraft = "SELECT * FROM articles WHERE state = 'draft'";
  const queryPublished = "SELECT * FROM articles WHERE state = 'published'";

  global.db.all(queryDraft, [], (err, draftArticles) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving draft articles.");
    }

    global.db.all(queryPublished, [], (err, publishedArticles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving published articles.");
      }

      res.render("sellerHome.ejs", {
        draftArticles: draftArticles || [],
        publishedArticles: publishedArticles || [],
      });
    });
  });
});

// Render the Create New Event page
router.get("/create", (req, res) => {
  res.render("editArticle.ejs", {
    article: {
      id: null, // Indicating it's a new event
      creation_date: new Date().toISOString().split("T")[0], // Current date
      title: "",
      insight: "",
      amenities: "",
      facilities: "",
      location: "",
      sellerName: "",
      sellerDetails: "",
      contactNumber: 65,

    },
  });
});

// Fetch draft and published events
router.get("/", (req, res) => {
  const queryDraft = "SELECT * FROM articles WHERE state = 'draft'";
  const queryPublished = "SELECT * FROM articles WHERE state = 'published'";

  global.db.all(queryDraft, [], (err, draftArticles) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving draft articles.");
    }

    global.db.all(queryPublished, [], (err, publishedArticles) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving published articles.");
      }

      res.render("sellerHome.ejs", {
        draftArticles: draftArticles || [],
        publishedArticles: publishedArticles || [],
      });
    });
  });
});

// Publish an event
router.post("/publish/:id", (req, res) => {
  const query = `
        UPDATE articles 
        SET state = 'published', published_date = datetime('now','localtime') 
        WHERE id = ?`;

  global.db.run(query, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error publishing article.");
    }
    res.redirect("/sellerHome");
  });
});

// Delete an event
router.post("/delete/:id", (req, res) => {
  const query = "DELETE FROM articles WHERE id = ?";
  global.db.run(query, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting event.");
    }
    res.redirect("/sellerHome");
  });
});

module.exports = router;
