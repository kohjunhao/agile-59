// Set up express, bodyparser and EJS
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Set location of static files
app.use(express.static(__dirname + '/public'));


// Set up SQLite
// Items in the global namespace are accessible throughout the node application
const sqlite3 = require('sqlite3').verbose();
global.db = new sqlite3.Database('./database.db', function (err) {
    if (err) {
        console.error(err);
        // Bail out if we can't connect to the DB
        process.exit(1);
    } else {
        console.log("Database connected");
        // Tell SQLite to pay attention to foreign key constraints
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

// Handle to logout and destory the seassion
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/sellerHome');
        }
        res.redirect('/login');
    });
});

// Add all the route handlers to the app under the paths

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const registerRoute = require('./routes/register');
app.use('/register', registerRoute);

const sellerHomeRoutes = require('./routes/sellerHome');
app.use('/sellerHome', requireSellerAccess, sellerHomeRoutes);

const editArticle = require('./routes/editArticle');
app.use('/editArticle', editArticle );

const buyRentHomeRoutes = require('./routes/buyRentHome');
app.use('/buyRentHome', buyRentHomeRoutes);

const buyRentArticleRoute = require('./routes/buyRentArticle');
app.use('/buyRentArticle', buyRentArticleRoute);

const toolsRoute = require('./routes/tools');
app.use('/tools', toolsRoute);

const callDisplayRoute = require('./routes/callDisplay');
app.use('/callDisplay', callDisplayRoute);

const projectHomeRoute = require('./routes/projectHome');
app.use('/projectHome', projectHomeRoute);

// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});






