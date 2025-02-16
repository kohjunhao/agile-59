const express = require("express");
const router = express.Router();

// Middleware to ensure user is logged in
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

router.get("/", requireLogin, (req, res) => {
    const userId = req.session.userId;
    
    // Fetch current user data
    const query = `SELECT user_name, email FROM users WHERE user_id = ?`;
    global.db.get(query, [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.redirect("/");
        }
        res.render("userProfile.ejs", { user });
    });
});

router.post("/", requireLogin, (req, res) => {
    const userId = req.session.userId;
    let { username, email, password } = req.body;

    // Update user data in the database
    let query, params;
    if (password) {
        query = `UPDATE users SET user_name = ?, email = ?, password = ? WHERE user_id = ?`;
        params = [username, email, password, userId];
    } else {
        query = `UPDATE users SET user_name = ?, email = ? WHERE user_id = ?`;
        params = [username, email, userId];
    }

    global.db.run(query, params, function (err) {
        if (err) {
            console.error(err);
            return res.send("Error updating profile.");
        }

        // Update session username
        req.session.username = username;
        res.redirect("/userProfile");
    });
});

module.exports = router;
