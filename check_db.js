const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.all("PRAGMA table_info(Comments)", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Columns in Comments table:");
            console.table(rows);
            const hasParentId = rows.some(r => r.name === 'parentId');
            console.log("Has parentId:", hasParentId);
        }
    });
});

db.close();
