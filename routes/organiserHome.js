const express = require("express");
const router = express.Router();


// fetch site setting, draft event and published event
router.get("/", (req, res) => {
    const querySiteSettings = "SELECT site_name, site_description FROM site_settings LIMIT 1";
    const queryDraft = "SELECT * FROM events WHERE state = 'draft'";
    const queryPublished = "SELECT * FROM events WHERE state = 'published'";
    
    // handle error if fail to retrive site setting, draft event and published event and render them to ejs
    global.db.get(querySiteSettings, (err, siteSettings) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving site settings.");
        }

        global.db.all(queryDraft, [], (err, draftEvents) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error retrieving draft events.");
            }
        
            global.db.all(queryPublished, [], (err, publishedEvents) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error retrieving published events.");
                }
        
                res.render("organiserHome.ejs", {
                    siteName: siteSettings ? siteSettings.site_name : "No Name Set",
                    siteDescription: siteSettings ? siteSettings.site_description : "No Description Set",
                    draftEvents: draftEvents || [],
                    publishedEvents: publishedEvents || [],
                });
            });
        });
    });
});

// Render the Create New Event page
router.get("/create", (req, res) => {
    res.render("editEvent.ejs", {
        event: {
            id: null, // Indicating it's a new event
            creation_date: new Date().toISOString().split("T")[0], // Current date
            title: "",
            description: "",
            full_price_tickets: 0,
            full_price_ticket_price: 0.0,
            concession_tickets: 0,
            concession_ticket_price: 0.0,
        },
    });
});

// Fetch draft and published events
router.get("/", (req, res) => {
    const queryDraft = "SELECT * FROM events WHERE state = 'draft'";
    const queryPublished = "SELECT * FROM events WHERE state = 'published'";

    global.db.all(queryDraft, [], (err, draftEvents) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving draft events.");
        }

        global.db.all(queryPublished, [], (err, publishedEvents) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error retrieving published events.");
            }

            
            res.render("organiserHome.ejs", {
                draftEvents: draftEvents || [], 
                publishedEvents: publishedEvents || [], 
            });
        });
    });
});

// Publish an event
router.post("/publish/:id", (req, res) => {
    const query = `
        UPDATE events 
        SET state = 'published', published_date = datetime('now','localtime') 
        WHERE id = ?`;

    global.db.run(query, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error publishing event.");
        }
        res.redirect("/organiserHome");
    });
});

// Delete an event
router.post("/delete/:id", (req, res) => {
    const query = "DELETE FROM events WHERE id = ?";
    global.db.run(query, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting event.");
        }
        res.redirect("/organiserHome");
    });
});


module.exports = router;

