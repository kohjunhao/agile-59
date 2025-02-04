// const express = require("express");
// const router = express.Router();

// //handle GET request for fetching a specific article ID for edit
// router.get("/:id", (req, res) => {
//     //retrive article details by ID
//     const query = "SELECT * FROM articles WHERE id = ?";
//     //error handling for different db error type
//     global.db.get(query, [req.params.id], (err, article) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Error retrieving article data.");
//         }
//         if (!article) {
//             return res.status(404).send("Article not found.");
//         }
//         //render the ejs with article details
//         res.render("editArticle.ejs", { article });
//     });
// });

// // //handle POST request for creating or updating article
// // router.post("/:id?", (req, res) => {
// //     if (req.params.id) {
// //         // Update existing article
// //         const query = `
// //             UPDATE articles 
// //             SET 
// //                 title = ?, 
// //                 description = ?,
// //                 insight = ?,
// //                 amenities = ?,  
// //                 facilities = ?,  
// //                 location = ?,  
// //                 housingType = ?,  
// //                 sellerName = ?,  
// //                 sellerDetails = ?,
// //                 contactNumber = ?,
// //                 status = ?,    
// //                 last_modified_date = datetime('now', 'localtime')
// //             WHERE id = ?`;

// //         const params = [
// //             req.body.title,
// //             req.body.description,
// //             req.body.insight,
// //             req.body.amenities,
// //             req.body.facilities,
// //             req.body.location,
// //             req.body.housingType,
// //             req.body.sellerName ,
// //             req.body.sellerDetails,
// //             req.body.contactNumber,
// //             req.body.status,
// //             req.params.id,
// //         ];

// //         global.db.run(query, params, function (err) {
// //             if (err) {
// //                 console.error(err);
// //                 return res.status(500).send("Error updating article.");
// //             }
// //             // redirect to sellerHome if successful update
// //             res.redirect("/sellerHome");
// //         });
// //     } else {
// //         // Create new article
// //         const query = `
// //             INSERT INTO articles (
// //                 title, 
// //                 description,
// //                 insight,
// //                 amenities,
// //                 facilities,
// //                 location,
// //                 housingType,
// //                 sellerName,
// //                 sellerDetails,
// //                 contactNumber,
// //                 status,
// //                 state, 
// //                 creation_date
// //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', datetime('now', 'localtime'))`;

// //         const params = [
// //             req.body.title,
// //             req.body.description,
// //             req.body.insight,
// //             req.body.amenities,
// //             req.body.facilities,
// //             req.body.location,
// //             req.body.housingType,
// //             req.body.sellerName ,
// //             req.body.sellerDetails,
// //             req.body.contactNumber,
// //             req.body.status,
// //         ];

// //         global.db.run(query, params, function (err) {
// //             if (err) {
// //                 console.error(err);
// //                 return res.status(500).send("Error creating article.");
// //             }
// //              // redirect to sellerHome if successful create the event
// //             res.redirect("/sellerHome");
// //         });
// //     }
// // });




// const fs = require("fs");
// const path = require("path");
// const { IncomingMessage } = require("http");
// const express = require("express");
// const router = express.Router();

// // Helper function to parse the multipart form-data
// function parseMultipartData(req, callback) {
//     const boundary = req.headers["content-type"].split(";")[1].split("=")[1];
//     const boundaryBuffer = Buffer.from("--" + boundary);
//     const endBoundaryBuffer = Buffer.from("--" + boundary + "--");
    
//     let data = [];
//     let currentPart = null;

//     req.on("data", (chunk) => {
//         data.push(chunk);
//     });

//     req.on("end", () => {
//         let buffer = Buffer.concat(data);

//         // Find the boundaries in the buffer
//         let startIndex = 0;
//         let parts = [];

//         while ((startIndex = buffer.indexOf(boundaryBuffer, startIndex)) !== -1) {
//             let endIndex = buffer.indexOf(boundaryBuffer, startIndex + boundaryBuffer.length);
//             if (endIndex === -1) break;

//             // Extract each part of the multipart data
//             let part = buffer.slice(startIndex + boundaryBuffer.length, endIndex).toString();
//             parts.push(part);
//             startIndex = endIndex;
//         }

//         // Parsing the individual parts from the buffer
//         parts.forEach((part) => {
//             const contentDisposition = part.match(/Content-Disposition: form-data; name="([^"]+)"/);
//             if (contentDisposition && contentDisposition[1] === "image") {
//                 // Extract file data
//                 const fileData = part.split("\r\n\r\n")[1].slice(0, -2); // Removing unwanted characters
//                 const fileName = `image_${Date.now()}${path.extname("image.jpg")}`;
//                 // const filePath = path.join(__dirname, "../public/uploads");
//                 const filePath = path.join(__dirname, "..", "public", "uploads", fileName);

//                 // Save the image file
//                 fs.writeFileSync(filePath, fileData);
//                 callback(filePath); // Callback to return the file path
//             }
//         });
//     });
// }

// //handle GET request for fetching a specific article ID for edit
// router.get("/:id", (req, res) => {
//     //retrive article details by ID
//     const query = "SELECT * FROM articles WHERE id = ?";
//     //error handling for different db error type
//     global.db.get(query, [req.params.id], (err, article) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("Error retrieving article data.");
//         }
//         if (!article) {
//             return res.status(404).send("Article not found.");
//         }
//         //render the ejs with article details
//         res.render("editArticle.ejs", { article });
//     });
// });

// router.post("/:id?", (req, res) => {
//     let imagePath = null;

//     if (req.headers["content-type"].startsWith("multipart/form-data")) {
//         parseMultipartData(req, (filePath) => {
//             imagePath = filePath;

//             if (req.params.id) {
//                 const query = `
//                     UPDATE articles 
//                     SET 
//                         title = ?, 
//                         description = ?,
//                         insight = ?,
//                         amenities = ?,  
//                         facilities = ?,  
//                         location = ?,  
//                         housingType = ?,  
//                         sellerName = ?,  
//                         sellerDetails = ?,
//                         contactNumber = ?,
//                         status = ?,    
//                         image_path = COALESCE(?, image_path),
//                         last_modified_date = datetime('now', 'localtime')
//                     WHERE id = ?`;

//                 const params = [
//                     req.body.title,
//                     req.body.description,
//                     req.body.insight,
//                     req.body.amenities,
//                     req.body.facilities,
//                     req.body.location,
//                     req.body.housingType,
//                     req.body.sellerName,
//                     req.body.sellerDetails,
//                     req.body.contactNumber,
//                     req.body.status,
//                     imagePath,
//                     req.params.id,
//                 ];

//                 global.db.run(query, params, function (err) {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).send("Error updating article.");
//                     }
//                     res.redirect("/sellerHome");
//                 });
//             } else {
//                 // Create new article
//                 const query = `
//                     INSERT INTO articles (
//                         title, 
//                         description,
//                         insight,
//                         amenities,
//                         facilities,
//                         location,
//                         housingType,
//                         sellerName,
//                         sellerDetails,
//                         contactNumber,
//                         status,
//                         state, 
//                         image_path,
//                         creation_date
//                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, datetime('now', 'localtime'))`;

//                 const params = [
//                     req.body.title,
//                     req.body.description,
//                     req.body.insight,
//                     req.body.amenities,
//                     req.body.facilities,
//                     req.body.location,
//                     req.body.housingType,
//                     req.body.sellerName,
//                     req.body.sellerDetails,
//                     req.body.contactNumber,
//                     req.body.status,
//                     imagePath,
//                 ];

//                 global.db.run(query, params, function (err) {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).send("Error creating article.");
//                     }
//                     res.redirect("/sellerHome");
//                 });
//             }
//         });
//     }
// });

// module.exports = router;


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

