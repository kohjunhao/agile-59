const express = require("express");
const router = express.Router();

//handle GET request for specific event by ID
router.get("/:id", (req, res) => {
    //fetch a single publiish event by ID
    const query = "SELECT * FROM events WHERE id = ? AND state = 'published'";
    //log db error and hanle thhe type of error respectively
    global.db.get(query, [req.params.id], (err, event) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving event details.");
        }
        if (!event) {
            return res.status(404).send("Event not found.");
        }
        // render the ejs with event details
        res.render("attEvent.ejs", { event });
    });
});

//handle POST request for booking ticket to specific event
router.post("/book/:id", (req, res) => {
    // extract the input of name, full price and concesion from request body
    const { name, fullPrice, concession } = req.body;
    //get event ID from UTL perameter
    const eventId = req.params.id;
    
    //fetch event details by ID
    const fetchEventQuery = "SELECT * FROM events WHERE id = ?";
    // update ticket count in event table
    const updateTicketsQuery = `
        UPDATE events 
        SET 
            full_price_tickets = full_price_tickets - ?, 
            concession_tickets = concession_tickets - ?
        WHERE id = ? AND 
              full_price_tickets >= ? AND 
              concession_tickets >= ?`;
    
    // insert new booking record to booking table
    const insertBookingQuery = `
        INSERT INTO bookings (event_id, name, ticket_type, tickets_bought, revenue) 
        VALUES (?, ?, ?, ?, ?)`;
    
    // fetch event details and log db error base on the respective errors type
    global.db.get(fetchEventQuery, [eventId], (err, event) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving event details.");
        }

        if (!event) {
            return res.status(404).send("Event not found.");
        }

        // Parse the ticket numbers or default to 0 if not provided
        const fullPriceTickets = parseInt(fullPrice || 0);
        const concessionTickets = parseInt(concession || 0);

        global.db.run(
            updateTicketsQuery,
            [
                fullPriceTickets,
                concessionTickets,
                eventId,
                fullPriceTickets,
                concessionTickets
            ],
            // log error id there a error in updating ticket count
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error updating ticket counts.");
                }

                // Insert bookings into the bookings table
                if (fullPriceTickets > 0) {
                    global.db.run(insertBookingQuery, [
                        eventId,
                        name,
                        "full_price",
                        fullPriceTickets,
                        fullPriceTickets * event.full_price_ticket_price
                    ]);
                }
                if (concessionTickets > 0) {
                    global.db.run(insertBookingQuery, [
                        eventId,
                        name,
                        "concession",
                        concessionTickets,
                        concessionTickets * event.concession_ticket_price
                    ]);
                }
                
                // redirect to attendee event page
                res.redirect(`/attEvent/${eventId}`);
            }
        );
    });
});

module.exports = router;
