const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    //sql query to fetch all publish articles, order from date in ascending order
    const queryPublishedArticles = "SELECT id, title, description, published_date, image_path FROM articles WHERE state = 'published' ORDER BY published_date ASC";
    
    //excute the sql query and log log error if fail to retrive article
    global.db.all(queryPublishedArticles, [], (err, articles) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving articles.");
        }
        
        //render the ejs, passing list of articles
        res.render("buyRentHome.ejs", {
            articles: articles || []
        });
    });
});

module.exports = router;