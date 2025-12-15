const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.all("PRAGMA table_info(Users)", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Columns in Users table:");
            console.table(rows);
            // Check avatar type
            const avatarCol = rows.find(r => r.name === 'avatar');
            console.log("Avatar Column Type:", avatarCol ? avatarCol.type : 'MISSING');
        }
    });
});

db.close();
