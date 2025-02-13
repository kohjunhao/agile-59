const express = require("express");
const session = require("express-session");
const router = express.Router();

// Configure session middleware
router.use(session({
    secret: "your_secret_key", 
    resave: false,
    saveUninitialized: true,
}));

// Amt of login attempts and timing lockout (5min)
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000;

// Render the login page
router.get("/", (req, res) => {
    const errorMessage = req.session.errorMessage || "";
    req.session.errorMessage = null; 
    res.render("login.ejs", { errorMessage });
});

router.post("/authenticate", (req, res) => {
    const { usernameOrEmail, password } = req.body;
    
    // Check if all fields are provided
    if (!usernameOrEmail || !password) {
        req.session.errorMessage = "All fields are required.";
        return res.redirect("/login");
    }
    
    // Initialize login attempts and lock status in session if not implemented
    if (!req.session.loginAttempts) {
        req.session.loginAttempts = 0;
        req.session.lockUntil = null;
    }
    
    // Check if the account is currently locked
    if (req.session.lockUntil && Date.now() < req.session.lockUntil) {
        req.session.errorMessage = "Too many failed attempts. Account locked for 5 minutes.";
        return res.redirect("/login");
    }
    
    //query to check if usere exist with given credentials
    const query = `SELECT * FROM users WHERE (user_name = ? OR email = ?) AND password = ?`;
    global.db.get(query, [usernameOrEmail, usernameOrEmail, password], (err, user) => {
        if (err) {
            console.error(err);
            req.session.errorMessage = "An error occurred.";
            return res.redirect("/login");
        }
        
        // handle login attemp failure
        if (!user) {
            req.session.loginAttempts += 1;
            
            // Lock account after hitting maximum attempts
            if (req.session.loginAttempts >= MAX_ATTEMPTS) {
                req.session.lockUntil = Date.now() + LOCK_TIME;
                req.session.errorMessage = "Too many failed attempts. Account locked for 5 minutes.";
                return res.redirect("/login");
            }

            req.session.errorMessage = "Invalid username/email or password.";
            return res.redirect("/login");
        }
        
        // handle invalid account type
        if (!['admin', 'seller', 'agent'].includes(user.account_type)) {
            req.session.errorMessage = "Access denied: Your account type does not have permission to access sell page.";
            return res.redirect("/login");
        }
        
        // Reset login attempts and lock status on successful login
        req.session.loginAttempts = 0;
        req.session.lockUntil = null;
        req.session.userId = user.user_id;

        // Redirect to stored page if exists, otherwise default to sellerHome
        const redirectTo = req.session.redirectTo || "/sellerHome";
        // Clear stored URL after redirecting
        delete req.session.redirectTo;  
        res.redirect(redirectTo);
    });
});

module.exports = router;
