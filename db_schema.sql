
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

-- Insert default data (if necessary here)

-- Insert a default admin account
INSERT INTO users (user_name, email, password, account_type) VALUES ('admin', 'admin@example.com', 'Admin@123', 'admin');

COMMIT;

