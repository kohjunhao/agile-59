// Set up express, bodyparser, and EJS
const express = require('express');
const session = require('express-session');
const path = require("path");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// Set the app to use EJS for rendering
app.set('view engine', 'ejs');

// Set location of static files (including frontend JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db', function (err) {
    if (err) {
        console.error(err);
        process.exit(1); // Exit if DB connection fails
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON");
    }
});

// Handle requests to the home page
app.get('/', (req, res) => {
    res.render('mainHome.ejs');
});

// Set up sessions
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
}));

// Middleware to restrict sell tab access to admin, seller, and agent only
function requireSellerAccess(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login'); 
    }

    const query = `SELECT account_type FROM users WHERE user_id = ?`;
    global.db.get(query, [req.session.userId], (err, user) => {
        if (err || !user || !['admin', 'seller', 'agent'].includes(user.account_type)) {
            return res.redirect('/login');
        }
        next();
    });
}

// Logout and destroy session
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/sellerHome');
        }
        res.redirect('/login');
    });
});

// Load route handlers
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const registerRoute = require('./routes/register');
app.use('/register', registerRoute);

const sellerHomeRoutes = require('./routes/sellerHome');
app.use('/sellerHome', requireSellerAccess, sellerHomeRoutes);

const editArticle = require('./routes/editArticle');
app.use('/editArticle', editArticle);

const buyRentHomeRoutes = require('./routes/buyRentHome');
app.use('/buyRentHome', buyRentHomeRoutes);

const buyRentArticleRoute = require('./routes/buyRentArticle');
app.use('/buyRentArticle', buyRentArticleRoute);

const toolsRoute = require('./routes/tools');
app.use('/tools', toolsRoute); // ✅ Corrected route prefix

const callDisplayRoute = require('./routes/callDisplay');
app.use('/callDisplay', callDisplayRoute);

const userProfileRoute = require('./routes/userProfile');
app.use('/userprofile', userProfileRoute);

const projectHomeRoute = require('./routes/projectHome');
app.use('/projectHome', projectHomeRoute);

// Start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});