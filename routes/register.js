const express = require("express");
const router = express.Router();

//render the registration page
router.get("/", (req, res) => {
    // render ejs with empty error msg
    res.render("register.ejs", { errorMessage: "" });
});

//handle  user registration
router.post("/add-user", (req, res) => {
    //extract username/email and password
    const { username, email, password, account_type } = req.body;
    
    // check if all field provide, if not throw error msg
    if (!username || !email || !password || !account_type) {
        return res.render("register.ejs", { errorMessage: "All fields are required." });
    }
    
    // query to inser new use info to user table
    const query = `INSERT INTO users (user_name, email, password, account_type) VALUES (?, ?, ?, ?)`;
    
    // excute the query with provided user details and handle any error types with error msg
    global.db.run(query, [username, email, password, account_type], function (err) {
        if (err) {
            console.error(err);
            return res.render("register.ejs", { errorMessage: "Error creating user. Email might already exist." });
        }
        // redirect user back to login after register
        res.redirect("/login");
    });
});

module.exports = router;
