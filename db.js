var sqlite3 = require('sqlite3').verbose()
const { v4: uuidv4 } = require('uuid');

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS user (
            id text PRIMARY KEY,
            ghid text NOT NULL,
            name text NOT NULL,
            login text,
            avatar_url text, 
            bio text, 
            email text UNIQUE, 
            created_at text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                console.error("Error creating database table")
            }
        });  
    }
});


module.exports = db