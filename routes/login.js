// const express = require("express");
// const session = require("express-session");
// const router = express.Router();

// // Configure session middleware
// router.use(session({
//     // secret key to sign the session ID cookie
//     secret: "your_secret_key", 
//     // prevent resave session if not been modify
//     resave: false,
//     //save a new session if not been modify          
//     saveUninitialized: true,   
// }));

// // Amt of login attempts and timing lockout(5min)
// const MAX_ATTEMPTS = 3;
// const LOCK_TIME = 5 * 60 * 1000; 

// // render the login page 
// router.get("/", (req, res) => {
//     const errorMessage = req.session.errorMessage || "";
//     // clear error msg for subsequent request
//     req.session.errorMessage = null; 
//     res.render("login.ejs", { errorMessage });
// });

// // Handle user authentication
// router.post("/authenticate", (req, res) => {
//     const { usernameOrEmail, password } = req.body;

//     // Check if all fields are provided
//     if (!usernameOrEmail || !password) {
//         req.session.errorMessage = "All fields are required.";
//         return res.redirect("/login");
//     }

//     // Initialize login attempts and lock status in session if not implemented
//     if (!req.session.loginAttempts) {
//         req.session.loginAttempts = 0;
//         req.session.lockUntil = null;
//     }

//     // Check if the account is currently locked
//     if (req.session.lockUntil && Date.now() < req.session.lockUntil) {
//         req.session.errorMessage = "Too many failed attempts. Account locked for 5 minutes.";
//         return res.redirect("/login");
//     }

//     //query to check if usere exist with given credentials
//     const query = `SELECT * FROM users WHERE (user_name = ? OR email = ?) AND password = ?`;

//     // excute query with the provided username/email and password
//     global.db.get(query, [usernameOrEmail, usernameOrEmail, password], (err, user) => {
//         if (err) {
//             console.error(err);
//             req.session.errorMessage = "An error occurred.";
//             return res.redirect("/login");
//         }

//         // If no user found, handle login failure
//         if (!user) {
//             //increase the login attemp by 1 
//             req.session.loginAttempts += 1;

//             // Lock account after hitting maximum attempts
//             if (req.session.loginAttempts >= MAX_ATTEMPTS) {
//                 req.session.lockUntil = Date.now() + LOCK_TIME;
//                 req.session.errorMessage = "Too many failed attempts. Account locked for 5 minutes.";
//                 return res.redirect("/login");
//             }

//             req.session.errorMessage = "Invalid username/email or password.";
//             return res.redirect("/login");
//         }

//         // Reset login attempts and lock status on successful login
//         req.session.loginAttempts = 0;
//         req.session.lockUntil = null;

//         // Save user ID to session and redirect to organiser home
//         req.session.userId = user.user_id;
//         res.redirect("/organiserHome");
//     });
// });

// module.exports = router;

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

// Handle user authentication
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
    // excute query with the provided username/email and password
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

        // Save user ID and account type to session and redirect to sell page
        req.session.userId = user.user_id;
        // res.redirect("/organiserHome");
        res.redirect("/sellerHome");
    });
});

module.exports = router;
