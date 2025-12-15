const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Use PostgreSQL if DATABASE_URL is provided (production), otherwise use SQLite (development)
if (process.env.DATABASE_URL) {
    // In production, use PostgreSQL (Render provides DATABASE_URL)
    console.log('🔌 Attempting to connect to PostgreSQL database...');
    
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        dialectOptions: {
            ssl: process.env.DB_SSL === 'false' ? false : {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    // Test the connection
    sequelize.authenticate()
        .then(() => {
            console.log('✅ PostgreSQL database connection established successfully.');
        })
        .catch(err => {
            console.error('❌ Unable to connect to PostgreSQL database:', err.message);
            console.error('Please check your DATABASE_URL environment variable.');
            // Don't exit - let the server start and show the error
        });
} else {
    // In development, use SQLite
    console.log('🔌 Using SQLite database for development...');
    
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });

    // Test the connection
    sequelize.authenticate()
        .then(() => {
            console.log('✅ SQLite database connection established successfully.');
        })
        .catch(err => {
            console.error('❌ Unable to connect to SQLite database:', err.message);
        });
}

module.exports = sequelize;
