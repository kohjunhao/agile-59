const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Read the schema file
const schemaPath = path.join(__dirname, '../db_schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Create and initialize the database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the database');
    
    // Execute the schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error executing schema:', err.message);
            process.exit(1);
        }
        console.log('Database schema initialized successfully');
        db.close();
    });
});
