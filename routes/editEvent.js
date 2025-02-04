// const express = require("express");
// const router = express.Router();

// //handle GET request for fetching a specific event ID for edit
// router.get("/:id", (req, res) => {
//     //retrive event details by ID
//     const query = "SELECT * FROM events WHERE id = ?";
//     //error handling for different db error type
//     global.db.get(query, [req.params.id], (err, event) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Error retrieving event data.");
//         }
//         if (!event) {
//             return res.status(404).send("Event not found.");
//         }
//         //render the ejs with event details
//         res.render("editEvent.ejs", { event });
//     });
// });

// //handle POST request for creating or updating event
// router.post("/:id?", (req, res) => {
//     if (req.params.id) {
//         // Update existing event
//         const query = `
//             UPDATE events 
//             SET 
//                 title = ?, 
//                 description = ?, 
//                 event_date = ?, 
//                 event_time = ?, 
//                 full_price_tickets = ?, 
//                 full_price_ticket_price = ?, 
//                 concession_tickets = ?, 
//                 concession_ticket_price = ?, 
//                 last_modified_date = datetime('now', 'localtime')
//             WHERE id = ?`;

//         const params = [
//             req.body.title,
//             req.body.description,
//             req.body.event_date,
//             req.body.event_time,
//             req.body.full_price_tickets,
//             req.body.full_price_ticket_price,
//             req.body.concession_tickets,
//             req.body.concession_ticket_price,
//             req.params.id,
//         ];

//         global.db.run(query, params, function (err) {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send("Error updating event.");
//             }
//             // redirect to organiserHome if successful update
//             res.redirect("/organiserHome");
//         });
//     } else {
//         // Create new event
//         const query = `
//             INSERT INTO events (
//                 title, 
//                 description,
//                 event_date, 
//                 event_time,
//                 full_price_tickets, 
//                 full_price_ticket_price, 
//                 concession_tickets, 
//                 concession_ticket_price, 
//                 state, 
//                 creation_date
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now', 'localtime'))`;

//         const params = [
//             req.body.title,
//             req.body.description,
//             req.body.event_date,
//             req.body.event_time,
//             req.body.full_price_tickets,
//             req.body.full_price_ticket_price,
//             req.body.concession_tickets,
//             req.body.concession_ticket_price,
//         ];

//         global.db.run(query, params, function (err) {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send("Error creating event.");
//             }
//              // redirect to organiserHome if successful create the event
//             res.redirect("/organiserHome");
//         });
//     }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();

// handle GET request for fetching a specific article ID for edit
router.get("/:id", (req, res) => {
    const query = "SELECT * FROM articles WHERE id = ?";
    global.db.get(query, [req.params.id], (err, article) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving article data.");
        }
        if (!article) {
            return res.status(404).send("Article not found.");
        }
        res.render("editArticle.ejs", { article });
    });
});

// handle POST request for creating or updating article
router.post("/:id?", (req, res) => {
    if (req.params.id) {
        // If ID is provided, update existing article
        const query = `
            UPDATE articles 
            SET 
                title = ?, 
                description = ?,  
                last_modified_date = datetime('now', 'localtime')
            WHERE id = ?`;

        const params = [
            req.body.title,
            req.body.description,
            req.params.id,  // the ID of the article
        ];

        global.db.run(query, params, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error updating article.");
            }
            res.redirect("/sellerHome");
        });
    } else {
        // If no ID, create a new article
        const query = `
            INSERT INTO articles (
                title, 
                description,
                state, 
                creation_date
            ) VALUES (?, ?, 'draft', datetime('now', 'localtime'))`;

        const params = [
            req.body.title,
            req.body.description,
        ];

        global.db.run(query, params, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error creating article.");
            }
            res.redirect("/sellerHome");
        });
    }
});

module.exports = router;
