const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.get("SELECT id, name, email, length(avatar) as avatarLength FROM Users WHERE id = 1", (err, row) => {
        if (err) {
            console.error(err);
        } else {
            console.log("User Row:", row);
        }
    });
});

db.close();
