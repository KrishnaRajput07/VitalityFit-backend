const sequelize = require('./database');
const Food = require('./models/Food');

const foodData = [
    // Main Courses & Curries
    { name: 'Butter Chicken', category: 'Main Course', calories: 490, protein: 25, carbs: 10, fat: 35 },
    { name: 'Chicken Tikka Masala', category: 'Main Course', calories: 450, protein: 28, carbs: 12, fat: 30 },
    { name: 'Rogan Josh', category: 'Main Course', calories: 520, protein: 22, carbs: 8, fat: 40 },
    { name: 'Palak Paneer', category: 'Main Course', calories: 340, protein: 18, carbs: 12, fat: 25 },
    { name: 'Dal Makhani', category: 'Main Course', calories: 380, protein: 14, carbs: 40, fat: 18 },
    { name: 'Chana Masala', category: 'Main Course', calories: 320, protein: 12, carbs: 50, fat: 8 },
    { name: 'Baingan Bharta', category: 'Main Course', calories: 230, protein: 6, carbs: 25, fat: 12 },
    { name: 'Aloo Gobi', category: 'Main Course', calories: 260, protein: 5, carbs: 35, fat: 10 },
    { name: 'Malai Kofta', category: 'Main Course', calories: 420, protein: 10, carbs: 32, fat: 28 },
    { name: 'Kadai Paneer', category: 'Main Course', calories: 360, protein: 18, carbs: 15, fat: 24 },

    // Breads
    { name: 'Naan', category: 'Bread', calories: 260, protein: 8, carbs: 45, fat: 5 },
    { name: 'Roti/Chapati', category: 'Bread', calories: 120, protein: 3, carbs: 20, fat: 3 },
    { name: 'Paratha', category: 'Bread', calories: 290, protein: 6, carbs: 38, fat: 12 },
    { name: 'Puri', category: 'Bread', calories: 140, protein: 2, carbs: 18, fat: 8 },
    { name: 'Bhatura', category: 'Bread', calories: 280, protein: 7, carbs: 42, fat: 10 },
    { name: 'Laccha Paratha', category: 'Bread', calories: 320, protein: 6, carbs: 40, fat: 15 },
    { name: 'Missi Roti', category: 'Bread', calories: 180, protein: 5, carbs: 25, fat: 6 },

    // Rice Dishes
    { name: 'Biryani (Chicken/Mutton)', category: 'Rice', calories: 550, protein: 22, carbs: 65, fat: 20 },
    { name: 'Pulao', category: 'Rice', calories: 380, protein: 8, carbs: 60, fat: 10 },
    { name: 'Jeera Rice', category: 'Rice', calories: 350, protein: 5, carbs: 62, fat: 8 },
    { name: 'Vegetable Biryani', category: 'Rice', calories: 400, protein: 9, carbs: 70, fat: 12 },
    { name: 'Matar Pulao', category: 'Rice', calories: 360, protein: 7, carbs: 64, fat: 8 },
    { name: 'Tomato Rice', category: 'Rice', calories: 340, protein: 5, carbs: 60, fat: 9 },

    // Street Foods
    { name: 'Pani Puri', category: 'Snack', calories: 220, protein: 4, carbs: 42, fat: 6 },
    { name: 'Bhel Puri', category: 'Snack', calories: 280, protein: 6, carbs: 50, fat: 8 },
    { name: 'Samosa', category: 'Snack', calories: 262, protein: 4, carbs: 24, fat: 17 },
    { name: 'Vada Pav', category: 'Snack', calories: 300, protein: 6, carbs: 45, fat: 12 },
    { name: 'Chole Bhature', category: 'Main Course', calories: 650, protein: 20, carbs: 80, fat: 25 },
    { name: 'Dosa', category: 'South Indian', calories: 168, protein: 4, carbs: 29, fat: 4 },
    { name: 'Idli', category: 'South Indian', calories: 39, protein: 2, carbs: 8, fat: 0 },
    { name: 'Pav Bhaji', category: 'Main Course', calories: 550, protein: 12, carbs: 65, fat: 22 },
    { name: 'Sev Puri', category: 'Snack', calories: 240, protein: 4, carbs: 35, fat: 10 },

    // Desserts
    { name: 'Gulab Jamun', category: 'Dessert', calories: 150, protein: 2, carbs: 25, fat: 6 },
    { name: 'Ras Malai', category: 'Dessert', calories: 220, protein: 6, carbs: 28, fat: 10 },
    { name: 'Kheer', category: 'Dessert', calories: 260, protein: 6, carbs: 35, fat: 12 },
    { name: 'Jalebi', category: 'Dessert', calories: 180, protein: 1, carbs: 30, fat: 8 },
    { name: 'Barfi', category: 'Dessert', calories: 120, protein: 3, carbs: 18, fat: 5 },
    { name: 'Ladoo', category: 'Dessert', calories: 200, protein: 3, carbs: 25, fat: 10 },
    { name: 'Shrikhand', category: 'Dessert', calories: 280, protein: 8, carbs: 30, fat: 12 },
    { name: 'Gajak', category: 'Dessert', calories: 140, protein: 3, carbs: 20, fat: 6 },
    { name: 'Malpua', category: 'Dessert', calories: 320, protein: 4, carbs: 45, fat: 15 },

    // Snacks & Appetizers
    { name: 'Pakora', category: 'Snack', calories: 180, protein: 4, carbs: 15, fat: 12 },
    { name: 'Dhokla', category: 'Snack', calories: 150, protein: 6, carbs: 20, fat: 5 },
    { name: 'Khandvi', category: 'Snack', calories: 160, protein: 5, carbs: 18, fat: 8 },
    { name: 'Chana Jor Garam', category: 'Snack', calories: 120, protein: 6, carbs: 18, fat: 3 },

    // Vegetarian Main Dishes (Duplicates handled or specific)
    { name: 'Matar Paneer', category: 'Main Course', calories: 380, protein: 16, carbs: 18, fat: 22 },
    { name: 'Shahi Paneer', category: 'Main Course', calories: 420, protein: 18, carbs: 20, fat: 28 },
    { name: 'Mushroom Masala', category: 'Main Course', calories: 280, protein: 10, carbs: 15, fat: 18 },
    { name: 'Soya Chunks Curry', category: 'Main Course', calories: 250, protein: 25, carbs: 15, fat: 8 },

    // Non-Vegetarian
    { name: 'Tandoori Chicken', category: 'Non-Veg', calories: 260, protein: 30, carbs: 5, fat: 12 },
    { name: 'Fish Curry', category: 'Non-Veg', calories: 320, protein: 25, carbs: 8, fat: 20 },
    { name: 'Mutton Curry', category: 'Non-Veg', calories: 550, protein: 30, carbs: 12, fat: 40 },
    { name: 'Egg Curry', category: 'Non-Veg', calories: 240, protein: 14, carbs: 8, fat: 18 },
    { name: 'Prawns Masala', category: 'Non-Veg', calories: 280, protein: 24, carbs: 10, fat: 15 },
    { name: 'Keema', category: 'Non-Veg', calories: 450, protein: 28, carbs: 10, fat: 35 },

    // Chutneys & Condiments
    { name: 'Mint Chutney', category: 'Condiment', calories: 40, protein: 1, carbs: 8, fat: 0 },
    { name: 'Tamarind Chutney', category: 'Condiment', calories: 90, protein: 1, carbs: 22, fat: 0 },
    { name: 'Coconut Chutney', category: 'Condiment', calories: 120, protein: 2, carbs: 6, fat: 10 }
];

const seed = async () => {
    try {
        await sequelize.sync(); // Create tables
        console.log('Database synced.');

        const count = await Food.count();
        if (count > 0) {
            console.log('Food data already exists. Skipping seed.');
            process.exit(0);
        }

        await Food.bulkCreate(foodData);
        console.log('Food seeded successfully!');
    } catch (err) {
        console.error('Error seeding food:', err);
    } finally {
        // Don't close connection if using sqlite file mode directly might be safer to let process exit
        // but explicit close is good practice
        // await sequelize.close(); 
        process.exit();
    }
};

seed();
