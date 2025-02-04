const express = require("express");
const router = express.Router();

// Retrieve the current site settings from the database
router.get("/", (req, res) => {
    // query to fetch site setting which is limited to 1 record
    const query = "SELECT site_name, site_description FROM site_settings LIMIT 1";
    //execute  query to get site setting
    global.db.get(query, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving site settings.");
        }
        
        // render the ejs with retrieved site setting
        res.render("siteSetting.ejs", {
            siteName: row ? row.site_name : "",
            siteDescription: row ? row.site_description : "",
        });
    });
});

// Update or insert the site settings in the database
router.post("/", (req, res) => {
    //extract the name and description
    const { name, description } = req.body;
    
    //check if all field are filled, if not throw error msg
    if (!name || !description) {
        return res.status(400).send("All fields are required.");
    }

    // query check if a record exists
    const checkQuery = "SELECT COUNT(*) as count FROM site_settings";
    global.db.get(checkQuery, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error checking site settings.");
        }
        
        //check if record exist
        const recordExists = row.count > 0;

        // If the record exists, update it; otherwise, insert a new record
        if (recordExists) {
            //update record
            const updateQuery = "UPDATE site_settings SET site_name = ?, site_description = ? WHERE setting_id = 1";
            global.db.run(updateQuery, [name, description], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error updating site settings.");
                }
                res.redirect("/organiserHome");
            });
        } else {
            //insert record
            const insertQuery = "INSERT INTO site_settings (site_name, site_description) VALUES (?, ?)";
            global.db.run(insertQuery, [name, description], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error inserting site settings.");
                }
                res.redirect("/organiserHome");
            });
        }
    });
});

module.exports = router;

