// Quick script to test database connection
require('dotenv').config();
const sequelize = require('./database');

async function testConnection() {
    try {
        console.log('\n🔍 Testing database connection...\n');
        
        // Test authentication
        await sequelize.authenticate();
        console.log('✅ Database connection authenticated successfully!\n');
        
        // Test query (different for PostgreSQL vs SQLite)
        const isPostgres = process.env.DATABASE_URL || sequelize.getDialect() === 'postgres';
        
        if (isPostgres) {
            const [results] = await sequelize.query('SELECT NOW() as current_time, version() as db_version');
            console.log('📊 Database Info (PostgreSQL):');
            console.log('   Current Time:', results[0].current_time);
            console.log('   Version:', results[0].db_version?.substring(0, 50) + '...\n');
        } else {
            const [results] = await sequelize.query("SELECT datetime('now') as current_time, sqlite_version() as db_version");
            console.log('📊 Database Info (SQLite):');
            console.log('   Current Time:', results[0].current_time);
            console.log('   Version:', results[0].db_version + '\n');
        }
        
        console.log('✅ All tests passed! Database is ready to use.\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database connection test failed!\n');
        console.error('Error:', error.message);
        console.error('\nTroubleshooting:');
        
        if (process.env.DATABASE_URL) {
            console.log('   - DATABASE_URL is set (PostgreSQL mode)');
            console.log('   - Check if your PostgreSQL database is running');
            console.log('   - Verify DATABASE_URL format is correct');
        } else {
            console.log('   - DATABASE_URL is not set (SQLite mode)');
            console.log('   - This is normal for local development');
        }
        
        console.log('\n');
        process.exit(1);
    }
}

testConnection();
