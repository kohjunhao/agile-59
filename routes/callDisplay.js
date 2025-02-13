const express = require("express");
const router = express.Router();

// router.get("/:articleId", (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/login');
//     }

//     const userQuery = `SELECT user_name, account_type FROM users WHERE user_id = ?`;
//     global.db.get(userQuery, [req.session.userId], (err, user) => {
//         if (err || !user || !['admin', 'buyer', 'agent'].includes(user.account_type)) {
//             return res.status(403).send("Access denied.");
//         }

//         const sellerQuery = `SELECT sellerName, contactNumber FROM articles WHERE id = ?`;
//         global.db.get(sellerQuery, [req.params.articleId], (err, seller) => {
//             if (err || !seller) {
//                 return res.status(404).send("Seller details not found.");
//             }

//             res.render("callDisplay.ejs", { user, seller });
//         });
//     });
// });

router.get("/:articleId", (req, res) => {
    if (!req.session.userId) {
        req.session.redirectTo = `/callDisplay/${req.params.articleId}`; 
        return res.redirect('/login');
    }

    const userQuery = `SELECT user_name, account_type FROM users WHERE user_id = ?`;
    global.db.get(userQuery, [req.session.userId], (err, user) => {
        if (err || !user || !['admin', 'buyer', 'agent'].includes(user.account_type)) {
            return res.status(403).send("Access denied.");
        }

        const sellerQuery = `SELECT sellerName, contactNumber FROM articles WHERE id = ?`;
        global.db.get(sellerQuery, [req.params.articleId], (err, seller) => {
            if (err || !seller) {
                return res.status(404).send("Seller details not found.");
            }

            res.render("callDisplay.ejs", { user, seller });
        });
    });
});


module.exports = router;

