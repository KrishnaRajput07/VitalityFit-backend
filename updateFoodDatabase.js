const sequelize = require('./database');
const Food = require('./models/Food');

const rawData = [
    // Fruits
    { name: 'Mango', category: 'Fruits', calories: 60, protein: 0.5, fat: 0.3 },
    { name: 'Banana', category: 'Fruits', calories: 89, protein: 1.1, fat: 0.3 },
    { name: 'Apple', category: 'Fruits', calories: 52, protein: 0.3, fat: 0.2 },
    { name: 'Orange', category: 'Fruits', calories: 47, protein: 0.9, fat: 0.1 },
    { name: 'Grapes', category: 'Fruits', calories: 69, protein: 0.7, fat: 0.2 },
    { name: 'Papaya', category: 'Fruits', calories: 43, protein: 0.5, fat: 0.3 },
    { name: 'Guava', category: 'Fruits', calories: 68, protein: 0.9, fat: 0.3 },
    { name: 'Pomegranate', category: 'Fruits', calories: 83, protein: 1.7, fat: 0.3 },
    { name: 'Watermelon', category: 'Fruits', calories: 30, protein: 0.6, fat: 0.2 },
    { name: 'Pineapple', category: 'Fruits', calories: 50, protein: 0.5, fat: 0.1 },

    // Grains & Cereals
    { name: 'Basmati Rice', category: 'Grains & Cereals', calories: 370, protein: 7, fat: 0.9 },
    { name: 'Wheat Flour (Atta)', category: 'Grains & Cereals', calories: 361, protein: 10, fat: 1.5 },
    { name: 'Oats', category: 'Grains & Cereals', calories: 389, protein: 13, fat: 7 },
    { name: 'Quinoa', category: 'Grains & Cereals', calories: 120, protein: 4, fat: 2 },
    { name: 'Brown Rice', category: 'Grains & Cereals', calories: 111, protein: 2.6, fat: 0.9 },
    { name: 'Ragi (Finger Millet)', category: 'Grains & Cereals', calories: 336, protein: 7.7, fat: 4.3 },
    { name: 'Jowar (Sorghum)', category: 'Grains & Cereals', calories: 329, protein: 11, fat: 3.3 },
    { name: 'Bajra (Pearl Millet)', category: 'Grains & Cereals', calories: 361, protein: 11, fat: 4.2 },

    // Legumes & Lentils
    { name: 'Chana Dal', category: 'Legumes & Lentils', calories: 360, protein: 20, fat: 5 },
    { name: 'Masoor Dal', category: 'Legumes & Lentils', calories: 116, protein: 9, fat: 0.5 },
    { name: 'Toor Dal', category: 'Legumes & Lentils', calories: 341, protein: 22, fat: 1.7 },
    { name: 'Urad Dal', category: 'Legumes & Lentils', calories: 341, protein: 24, fat: 1.4 },
    { name: 'Moong Dal', category: 'Legumes & Lentils', calories: 347, protein: 24, fat: 1.2 },
    { name: 'Rajma', category: 'Legumes & Lentils', calories: 340, protein: 22, fat: 1.3 },
    { name: 'Chickpeas (Chana)', category: 'Legumes & Lentils', calories: 364, protein: 20, fat: 6 },

    // Vegetables
    { name: 'Potato', category: 'Vegetables', calories: 77, protein: 2, fat: 0.1 },
    { name: 'Tomato', category: 'Vegetables', calories: 18, protein: 0.9, fat: 0.2 },
    { name: 'Onion', category: 'Vegetables', calories: 40, protein: 1.1, fat: 0.1 },
    { name: 'Cauliflower', category: 'Vegetables', calories: 25, protein: 1.9, fat: 0.3 },
    { name: 'Spinach', category: 'Vegetables', calories: 23, protein: 2.9, fat: 0.4 },
    { name: 'Cabbage', category: 'Vegetables', calories: 25, protein: 1.3, fat: 0.1 },
    { name: 'Carrot', category: 'Vegetables', calories: 41, protein: 0.9, fat: 0.2 },
    { name: 'Green Peas', category: 'Vegetables', calories: 81, protein: 5, fat: 0.4 },
    { name: 'Ladyfinger (Okra)', category: 'Vegetables', calories: 30, protein: 1.9, fat: 0.2 },
    { name: 'Bottle Gourd', category: 'Vegetables', calories: 15, protein: 0.6, fat: 0.1 },

    // Dairy Products
    { name: "Cow's Milk", category: 'Dairy', calories: 42, protein: 3.4, fat: 1.9 },
    { name: 'Buffalo Milk', category: 'Dairy', calories: 97, protein: 4.9, fat: 6.9 },
    { name: 'Paneer', category: 'Dairy', calories: 265, protein: 18, fat: 20 },
    { name: 'Curd/Yogurt', category: 'Dairy', calories: 59, protein: 3.5, fat: 3.3 },
    { name: 'Ghee', category: 'Dairy', calories: 900, protein: 0, fat: 100 },
    { name: 'Butter', category: 'Dairy', calories: 717, protein: 0.9, fat: 81 },

    // Nuts & Seeds
    { name: 'Almonds', category: 'Nuts & Seeds', calories: 579, protein: 21, fat: 50 },
    { name: 'Cashews', category: 'Nuts & Seeds', calories: 553, protein: 18, fat: 44 },
    { name: 'Walnuts', category: 'Nuts & Seeds', calories: 654, protein: 15, fat: 65 },
    { name: 'Pistachios', category: 'Nuts & Seeds', calories: 562, protein: 21, fat: 45 },
    { name: 'Chia Seeds', category: 'Nuts & Seeds', calories: 486, protein: 16, fat: 31 },
    { name: 'Flax Seeds', category: 'Nuts & Seeds', calories: 534, protein: 18, fat: 42 },
    { name: 'Pumpkin Seeds', category: 'Nuts & Seeds', calories: 559, protein: 30, fat: 49 },

    // Snacks & Street Foods
    { name: 'Samosa', category: 'Snacks', calories: 266, protein: 4, fat: 21 },
    { name: 'Pakora', category: 'Snacks', calories: 153, protein: 3, fat: 10 },
    { name: 'Bread (White)', category: 'Snacks', calories: 265, protein: 9, fat: 3.2 },
    { name: 'Bread (Brown)', category: 'Snacks', calories: 265, protein: 9, fat: 3.2 },
    { name: 'Poha', category: 'Snacks', calories: 68, protein: 2, fat: 0.2 },
    { name: 'Upma', category: 'Snacks', calories: 110, protein: 3, fat: 3.5 },
    { name: 'Chivda', category: 'Snacks', calories: 573, protein: 10, fat: 43 },
    { name: 'Chana Jor Garam', category: 'Snacks', calories: 312, protein: 6, fat: 22 },
    { name: 'Bhel Puri', category: 'Snacks', calories: 432, protein: 6, fat: 25 },
    { name: 'Chilli Potato', category: 'Snacks', calories: 125, protein: 3, fat: 5 },
    { name: 'Masala Papad', category: 'Snacks', calories: 460, protein: 10, fat: 28 },
    { name: 'Mixture', category: 'Snacks', calories: 520, protein: 8, fat: 30 },
    { name: 'Bread Pakora', category: 'Snacks', calories: 269, protein: 7, fat: 15 },
    { name: 'Vada Pav', category: 'Snacks', calories: 267, protein: 7, fat: 15 },
    { name: 'Masala Dosa', category: 'Snacks', calories: 110, protein: 4, fat: 5 },
    { name: 'Idli', category: 'Snacks', calories: 39, protein: 1, fat: 0.1 },
    { name: 'Uthappam', category: 'Snacks', calories: 58, protein: 2, fat: 2 },
    { name: 'Chilla', category: 'Snacks', calories: 127, protein: 5, fat: 5 },
    { name: 'Sev Puri', category: 'Snacks', calories: 460, protein: 6, fat: 28 },
    { name: 'Dosa', category: 'Snacks', calories: 110, protein: 4, fat: 5 },
    { name: 'Gathiya', category: 'Snacks', calories: 462, protein: 8, fat: 32 },
    { name: 'Fafda', category: 'Snacks', calories: 462, protein: 8, fat: 32 },
    { name: 'Khandvi', category: 'Snacks', calories: 138, protein: 3, fat: 7 },
    { name: 'Dhokla', category: 'Snacks', calories: 158, protein: 4, fat: 10 },
    { name: 'Patra', category: 'Snacks', calories: 312, protein: 9, fat: 22 },
    { name: 'Thepla', category: 'Snacks', calories: 322, protein: 8, fat: 22 },
    { name: 'Mathri', category: 'Snacks', calories: 520, protein: 8, fat: 30 },
    { name: 'Namak Pare', category: 'Snacks', calories: 520, protein: 8, fat: 30 },
    { name: 'Bhakarwadi', category: 'Snacks', calories: 462, protein: 6, fat: 28 },
    { name: 'Shakarpara', category: 'Snacks', calories: 462, protein: 8, fat: 32 },
    { name: 'Chakli', category: 'Snacks', calories: 462, protein: 8, fat: 32 },
    { name: 'Baked Chakli', category: 'Snacks', calories: 460, protein: 8, fat: 30 },
    { name: 'Murmura', category: 'Snacks', calories: 370, protein: 7, fat: 5 },
    { name: 'Dhania Pudina', category: 'Snacks', calories: 462, protein: 8, fat: 32 },
    { name: 'Masala Peanuts', category: 'Snacks', calories: 567, protein: 26, fat: 49 },
    { name: 'Masala Cashews', category: 'Snacks', calories: 553, protein: 18, fat: 44 },
    { name: 'Roasted Makhana', category: 'Snacks', calories: 345, protein: 9, fat: 0.1 },
    { name: 'Roasted Chana', category: 'Snacks', calories: 312, protein: 6, fat: 5 },
    { name: 'Baked Makhana', category: 'Snacks', calories: 345, protein: 9, fat: 0.1 },
    { name: 'Baked Chana', category: 'Snacks', calories: 120, protein: 6, fat: 1 },
    { name: 'Baked Moong Dal', category: 'Snacks', calories: 345, protein: 24, fat: 1 },
    { name: 'Baked Masala Mixture', category: 'Snacks', calories: 460, protein: 8, fat: 28 },

    // Beverages
    { name: 'Tea (Black, without milk)', category: 'Beverages', calories: 1, protein: 0.1, fat: 0 },
    { name: 'Tea (with milk and sugar)', category: 'Beverages', calories: 56, protein: 1.4, fat: 1.5 },
    { name: 'Coffee (black)', category: 'Beverages', calories: 2, protein: 0.1, fat: 0 },
    { name: 'Coffee (with milk)', category: 'Beverages', calories: 60, protein: 2, fat: 2.4 },
    { name: 'Coconut Water', category: 'Beverages', calories: 19, protein: 0.7, fat: 0.2 },
    { name: 'Lassi', category: 'Beverages', calories: 62, protein: 3.5, fat: 3.3 },
    { name: 'Buttermilk', category: 'Beverages', calories: 37, protein: 3.1, fat: 1.1 },
    { name: 'Sugarcane Juice', category: 'Beverages', calories: 127, protein: 0.4, fat: 0.3 },
    { name: 'Fruit Juice', category: 'Beverages', calories: 45, protein: 0.7, fat: 0.3 },
    { name: 'Soda', category: 'Beverages', calories: 41, protein: 0, fat: 0 },
    { name: 'Energy Drink', category: 'Beverages', calories: 45, protein: 0, fat: 0 },

    // Sweets & Desserts
    { name: 'Gulab Jamun', category: 'Sweets', calories: 274, protein: 4, fat: 7 },
    { name: 'Jalebi', category: 'Sweets', calories: 350, protein: 3, fat: 2 },
    { name: 'Barfi', category: 'Sweets', calories: 423, protein: 4, fat: 16 },
    { name: 'Ladoo', category: 'Sweets', calories: 377, protein: 5, fat: 10 },
    { name: 'Kheer', category: 'Sweets', calories: 213, protein: 4, fat: 7 },
    { name: 'Rasmalai', category: 'Sweets', calories: 323, protein: 8, fat: 19 },
    { name: 'Rasgulla', category: 'Sweets', calories: 186, protein: 3, fat: 4 },
    { name: 'Halwa', category: 'Sweets', calories: 389, protein: 6, fat: 16 },
    { name: 'Gajak', category: 'Sweets', calories: 460, protein: 8, fat: 28 },
    { name: 'Chikki', category: 'Sweets', calories: 460, protein: 8, fat: 28 },
    { name: 'Pedha', category: 'Sweets', calories: 349, protein: 7, fat: 16 },
    { name: 'Petha', category: 'Sweets', calories: 322, protein: 2, fat: 0.1 },
    { name: 'Imarti', category: 'Sweets', calories: 350, protein: 3, fat: 2 },
    { name: 'Shrikhand', category: 'Sweets', calories: 187, protein: 4, fat: 7 },
    { name: 'Rabri', category: 'Sweets', calories: 215, protein: 5, fat: 11 },
    { name: 'Malpua', category: 'Sweets', calories: 350, protein: 6, fat: 15 },
    { name: 'Ghevar', category: 'Sweets', calories: 350, protein: 6, fat: 15 },
    { name: 'Balushahi', category: 'Sweets', calories: 460, protein: 8, fat: 28 },
    { name: 'Kaju Katli', category: 'Sweets', calories: 553, protein: 10, fat: 35 },
    { name: 'Besan Ladoo', category: 'Sweets', calories: 460, protein: 8, fat: 28 },
    { name: 'Rava Ladoo', category: 'Sweets', calories: 460, protein: 8, fat: 28 },
    { name: 'Nankhatai', category: 'Sweets', calories: 482, protein: 7, fat: 25 },
    { name: 'Shakkarpara', category: 'Sweets', calories: 462, protein: 8, fat: 32 },

    // Oils & Fats
    { name: 'Mustard Oil', category: 'Oils', calories: 884, protein: 0, fat: 100 },
    { name: 'Coconut Oil', category: 'Oils', calories: 862, protein: 0, fat: 100 },
    { name: 'Sesame Oil', category: 'Oils', calories: 884, protein: 0, fat: 100 },
    { name: 'Groundnut Oil', category: 'Oils', calories: 884, protein: 0, fat: 100 },
    { name: 'Sunflower Oil', category: 'Oils', calories: 884, protein: 0, fat: 100 },

    // Spices & Condiments
    { name: 'Turmeric', category: 'Spices', calories: 312, protein: 9, fat: 9 },
    { name: 'Cumin Seeds', category: 'Spices', calories: 375, protein: 18, fat: 22 },
    { name: 'Coriander Seeds', category: 'Spices', calories: 298, protein: 12, fat: 18 },
    { name: 'Red Chilli Powder', category: 'Spices', calories: 282, protein: 12, fat: 12 },
    { name: 'Black Pepper', category: 'Spices', calories: 251, protein: 10, fat: 3 },
    { name: 'Cardamom', category: 'Spices', calories: 311, protein: 11, fat: 7 },
    { name: 'Cinnamon', category: 'Spices', calories: 247, protein: 4, fat: 2 },
    { name: 'Cloves', category: 'Spices', calories: 275, protein: 6, fat: 13 },
    { name: 'Garam Masala', category: 'Spices', calories: 325, protein: 14, fat: 15 },

    // Packaged & Commercial Snacks
    { name: 'Potato Chips', category: 'Snacks', calories: 539, protein: 7, fat: 35 },
    { name: 'French Fries', category: 'Snacks', calories: 312, protein: 3, fat: 15 },
    { name: 'Biscuits', category: 'Snacks', calories: 484, protein: 7, fat: 25 },
    { name: 'Cookies', category: 'Snacks', calories: 484, protein: 7, fat: 25 },
    { name: 'Choco Chips', category: 'Snacks', calories: 484, protein: 7, fat: 25 },
    { name: 'Wafers', category: 'Snacks', calories: 539, protein: 7, fat: 35 },
    { name: 'Puffed Rice', category: 'Snacks', calories: 370, protein: 7, fat: 5 },
    { name: 'Corn Flakes', category: 'Snacks', calories: 387, protein: 7, fat: 1 },
    { name: 'Granola', category: 'Snacks', calories: 489, protein: 14, fat: 22 },
    { name: 'Energy Bars', category: 'Snacks', calories: 400, protein: 10, fat: 15 },
    { name: 'Protein Bars', category: 'Snacks', calories: 400, protein: 20, fat: 10 },
    { name: 'Popcorn', category: 'Snacks', calories: 387, protein: 9, fat: 5 },
    { name: 'Peanut Butter', category: 'Snacks', calories: 588, protein: 25, fat: 50 },
    { name: 'Jam', category: 'Snacks', calories: 250, protein: 0.5, fat: 0.1 },
    { name: 'Honey', category: 'Snacks', calories: 304, protein: 0.3, fat: 0 },
    { name: 'Nutella', category: 'Snacks', calories: 539, protein: 6, fat: 31 },

    // Regional Specialties
    { name: 'Pani Puri', category: 'Regional', calories: 120, protein: 2, fat: 2 },
    { name: 'Dahi Puri', category: 'Regional', calories: 180, protein: 4, fat: 8 },
    { name: 'Vada', category: 'Regional', calories: 267, protein: 7, fat: 15 },
    { name: 'Bajji', category: 'Regional', calories: 153, protein: 3, fat: 10 },
    { name: 'Bonda', category: 'Regional', calories: 267, protein: 7, fat: 15 },
    { name: 'Misal Pav', category: 'Regional', calories: 150, protein: 8, fat: 8 },
    { name: 'Pav Bhaji', category: 'Regional', calories: 267, protein: 7, fat: 15 },
    { name: 'Chaat', category: 'Regional', calories: 120, protein: 2, fat: 2 },
    { name: 'Golgappa', category: 'Regional', calories: 120, protein: 2, fat: 2 },
    { name: 'Ragda Pattice', category: 'Regional', calories: 180, protein: 4, fat: 8 },
    { name: 'Kachori', category: 'Regional', calories: 520, protein: 8, fat: 30 },

    // Asian
    { name: 'Spring Rolls', category: 'Asian', calories: 198, protein: 3, fat: 11 },
    { name: 'Egg Rolls', category: 'Asian', calories: 207, protein: 4, fat: 12 },
    { name: 'Wontons', category: 'Asian', calories: 112, protein: 6, fat: 5 },
    { name: 'Potstickers', category: 'Asian', calories: 60, protein: 2, fat: 2 },
    { name: 'Dim Sum', category: 'Asian', calories: 85, protein: 3, fat: 3 },
    { name: 'Sesame Balls', category: 'Asian', calories: 262, protein: 5, fat: 13 },
    { name: 'Fortune Cookies', category: 'Asian', calories: 382, protein: 7, fat: 14 },
    { name: 'Crab Rangoon', category: 'Asian', calories: 146, protein: 3, fat: 9 },
    { name: 'Shumai', category: 'Asian', calories: 71, protein: 4, fat: 3 },
    { name: 'Edamame', category: 'Asian', calories: 121, protein: 11, fat: 5 },
    { name: 'Wonton Soup', category: 'Asian', calories: 35, protein: 2, fat: 1 },
    { name: 'Hot and Sour Soup', category: 'Asian', calories: 41, protein: 2, fat: 1 },
    { name: 'Egg Drop Soup', category: 'Asian', calories: 41, protein: 2, fat: 1 },
    { name: 'Spring Roll Wrappers', category: 'Asian', calories: 327, protein: 7, fat: 15 },
    { name: 'Soy Sauce', category: 'Asian', calories: 60, protein: 5, fat: 0 },
    { name: 'Sriracha', category: 'Asian', calories: 89, protein: 0, fat: 0 },

    // Italian Snacks
    { name: 'Bruschetta', category: 'Italian', calories: 120, protein: 4, fat: 6 },
    { name: 'Crostini', category: 'Italian', calories: 120, protein: 4, fat: 6 },
    { name: 'Antipasto', category: 'Italian', calories: 250, protein: 10, fat: 20 },
    { name: 'Arancini', category: 'Italian', calories: 180, protein: 5, fat: 10 },
    { name: 'Focaccia', category: 'Italian', calories: 266, protein: 9, fat: 9 },
    { name: 'Grissini', category: 'Italian', calories: 347, protein: 10, fat: 10 },
    { name: 'Taralli', category: 'Italian', calories: 460, protein: 8, fat: 28 },
    { name: 'Biscotti', category: 'Italian', calories: 484, protein: 7, fat: 25 },
    { name: 'Cannoli', category: 'Italian', calories: 350, protein: 4, fat: 15 },
    { name: 'Tiramisu', category: 'Italian', calories: 300, protein: 4, fat: 12 },
    { name: 'Panettone', category: 'Italian', calories: 350, protein: 7, fat: 10 },
    { name: 'Crostata', category: 'Italian', calories: 350, protein: 5, fat: 15 },
    { name: 'Gelato', category: 'Italian', calories: 200, protein: 4, fat: 10 },
    { name: 'Semifreddo', category: 'Italian', calories: 250, protein: 5, fat: 15 },
    { name: 'Ricotta Cookies', category: 'Italian', calories: 400, protein: 6, fat: 20 },
    { name: 'Panzerotti', category: 'Italian', calories: 267, protein: 7, fat: 15 },
    { name: 'Supplì', category: 'Italian', calories: 267, protein: 7, fat: 15 }
];

const updateDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced.');

        let addedCount = 0;
        let skippedCount = 0;

        for (const item of rawData) {
            // Calculate Carbs: (Calories - (Protein * 4) - (Fat * 9)) / 4
            let calculatedCarbs = (item.calories - (item.protein * 4) - (item.fat * 9)) / 4;
            // Ensure non-negative and round to 1 decimal
            calculatedCarbs = Math.max(0, parseFloat(calculatedCarbs.toFixed(1)));

            const [food, created] = await Food.findOrCreate({
                where: { name: item.name },
                defaults: {
                    category: item.category,
                    calories: item.calories,
                    protein: item.protein,
                    fat: item.fat,
                    carbs: calculatedCarbs
                }
            });

            if (created) {
                console.log(`Added: ${item.name} (Carbs: ${calculatedCarbs}g)`);
                addedCount++;
            } else {
                // Optional: Update existing if we want to overwrite
                // await food.update({ ...item, carbs: calculatedCarbs });
                skippedCount++;
            }
        }

        console.log(`\nUpdate Complete! Added: ${addedCount}, Skipped: ${skippedCount}`);

    } catch (err) {
        console.error('Error updating database:', err);
    } finally {
        process.exit();
    }
};

updateDatabase();
