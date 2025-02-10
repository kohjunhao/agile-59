const express = require("express");
const router = express.Router();

//handle GET request for specific article by ID
router.get("/:id", (req, res) => {
    //fetch a single publiish event by ID
    const query = "SELECT * FROM articles WHERE id = ? AND state = 'published'";
    //log db error and hanle the type of error respectively
    global.db.get(query, [req.params.id], (err, article) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving article details.");
        }
        if (!article) {
            return res.status(404).send("Article not found.");
        }
        // render the ejs with article details
        res.render("buyRentArticle.ejs", { article });
        
    });
});



module.exports = router;
