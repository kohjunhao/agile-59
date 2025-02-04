
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- Create your tables with SQL commands here (watch out for slight syntactical differences with SQLite vs MySQL)

-- create table store user details for login
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK(account_type IN ('buyer', 'seller', 'agent', 'admin'))
);

-- create table store user site detail for site setting
CREATE TABLE IF NOT EXISTS site_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT NOT NULL,
    site_description TEXT NOT NULL
);

-- create table store detail for events
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TEXT NOT NULL, 
    event_time TEXT NOT NULL, 
    full_price_tickets INTEGER NOT NULL,
    full_price_ticket_price REAL NOT NULL,
    concession_tickets INTEGER NOT NULL,
    concession_ticket_price REAL NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('draft', 'published')),
    creation_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    published_date TEXT
);

CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    state TEXT NOT NULL CHECK(state IN ('draft', 'published')),
    creation_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    published_date TEXT,
    insight TEXT NOT NULL,
    amenities TEXT NOT NULL,
    facilities TEXT NOT NULL,
    location TEXT NOT NULL,
    housingType TEXT NOT NULL CHECK(housingType IN('HDB', 'Condo', 'Private property', 'Others')),
    sellerName TEXT NOT NULL,
    sellerDetails TEXT NOT NULL,
    contactNumber TEXT NOT NULL CHECK(LENGTH(contactNumber)=10),
    status TEXT NOT NULL CHECK(status IN('Buy', 'Rent')),
    image_path TEXT
);

-- create table store booking info for view booking info
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    ticket_type TEXT NOT NULL CHECK(ticket_type IN ('full_price', 'concession')),
    tickets_bought INTEGER NOT NULL,
    revenue REAL NOT NULL,
    FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
);


-- Insert default data (if necessary here)

-- Insert a default site setting
INSERT INTO site_settings (site_name, site_description) VALUES ('Default Site Name', 'Default Description');

-- Insert a default admin account
INSERT INTO users (user_name, email, password, account_type) VALUES ('admin', 'admin@example.com', 'Admin@123', 'admin');

COMMIT;

