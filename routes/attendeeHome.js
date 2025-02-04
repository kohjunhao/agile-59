const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    //sql query to fetch all publish event, order from date in ascending order
    const queryPublishedEvents = "SELECT id, title, event_date FROM events WHERE state = 'published' ORDER BY event_date ASC";
    
    //excute the sql query and log log error if fail to retrive event
    global.db.all(queryPublishedEvents, [], (err, events) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving events.");
        }
        
        //render the ejs, passing list of events
        res.render("attendeeHome.ejs", {
            events: events || []
        });
    });
});

module.exports = router;