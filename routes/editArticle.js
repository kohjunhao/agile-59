const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

//handle GET request for fetching a specific article ID for edit
router.get("/:id", (req, res) => {
    //retrive article details by ID
    const query = "SELECT * FROM articles WHERE id = ?";
    //error handling for different db error type
    global.db.get(query, [req.params.id], (err, article) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving article data.");
        }
        if (!article) {
            return res.status(404).send("Article not found.");
        }
        //render the ejs with article details
        res.render("editArticle.ejs", { article });
    });
});

router.post("/:id?", upload.single("image"), (req, res) => {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (req.params.id) {
        // Update existing article
        const query = `
            UPDATE articles 
            SET 
                title = ?, 
                description = ?,
                insight = ?,
                amenities = ?,  
                facilities = ?,  
                location = ?,  
                housingType = ?,  
                sellerName = ?,  
                sellerDetails = ?,
                contactNumber = ?,
                status = ?,    
                image_path = COALESCE(?, image_path),
                last_modified_date = datetime('now', 'localtime')
            WHERE id = ?`;

        const params = [
            req.body.title,
            req.body.description,
            req.body.insight,
            req.body.amenities,
            req.body.facilities,
            req.body.location,
            req.body.housingType,
            req.body.sellerName,
            req.body.sellerDetails,
            req.body.contactNumber,
            req.body.status,
            imagePath,
            req.params.id,
        ];

        global.db.run(query, params, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error updating article.");
            }
            res.redirect("/sellerHome");
        });
    } else {
        // Create new article
        const query = `
            INSERT INTO articles (
                title, 
                description,
                insight,
                amenities,
                facilities,
                location,
                housingType,
                sellerName,
                sellerDetails,
                contactNumber,
                status,
                state, 
                image_path,
                creation_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, datetime('now', 'localtime'))`;

        const params = [
            req.body.title,
            req.body.description,
            req.body.insight,
            req.body.amenities,
            req.body.facilities,
            req.body.location,
            req.body.housingType,
            req.body.sellerName,
            req.body.sellerDetails,
            req.body.contactNumber,
            req.body.status,
            imagePath,
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

