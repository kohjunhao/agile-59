const express = require("express");
const router = express.Router();

//handle POST request for specific event by event ID
router.post("/:eventId", (req, res) => {
    //extract the event ID
    const eventId = req.params.eventId;
    
    // query to retrieve event title base on the event ID
    const eventQuery = "SELECT title FROM events WHERE id = ?";
    // query to retrieve booking detail for specific event
    const bookingsQuery = `
        SELECT 
            name AS buyer_name,
            CASE
                WHEN ticket_type = 'full_price' THEN 'Full Price'
                WHEN ticket_type = 'concession' THEN 'Concession'
            END AS ticket_type,
            tickets_bought,
            revenue
        FROM bookings 
        WHERE event_id = ?`;
    
    // handle event detail related error if event not found
    global.db.get(eventQuery, [eventId], (err, event) => {
        if (err || !event) {
            console.error(err || "Event not found.");
            return res.status(500).send("Error retrieving event details.");
        }
        
        // handle booking related error if unable to retrieve booking detail
        global.db.all(bookingsQuery, [eventId], (err, bookings) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error retrieving bookings.");
            }
            
            // render the ejs with event and booking info
            res.render("viewBooking.ejs", {
                event,
                bookings: bookings || []
            });
        });
    });
});

module.exports = router;

