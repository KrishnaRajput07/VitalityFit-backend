const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Schedule = require('./models/Schedule');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Club = require('./models/Club');
const ActivityLog = require('./models/ActivityLog');
const NutritionLog = require('./models/NutritionLog');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: true, // Reflects the request origin, allowing all origins with credentials
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sync Database with error handling
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synced successfully');
    })
    .catch((err) => {
        console.error('❌ Database sync failed:', err.message);
        console.error('Server will continue to run, but database operations may fail.');
    });

// --- Auth ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, age, gender, height, weight } = req.body;

        // Validation
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password with bcrypt (10 salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with hashed password
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            height,
            weight
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.password;

        res.json({ token, user: userResponse });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Remove password from response
        const userResponse = { ...user.toJSON() };
        delete userResponse.password;

        res.json({ token, user: userResponse });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- User & Schedule ---
app.get('/api/user/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

app.put('/api/user/:id', async (req, res) => {
    await User.update(req.body, { where: { id: req.params.id } });
    const updated = await User.findByPk(req.params.id);
    res.json(updated);
});

app.get('/api/schedule/:userId', async (req, res) => {
    const schedule = await Schedule.findAll({ where: { userId: req.params.userId } });
    res.json(schedule);
});

app.post('/api/schedule', async (req, res) => {
    const { userId, day, muscleGroup, exercises, time, notes } = req.body;
    const item = await Schedule.create({ userId, day, muscleGroup, exercises, time, notes });
    res.json(item);
});

app.delete('/api/schedule/:id', async (req, res) => {
    await Schedule.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
});

// --- Nutrition (Database-based) ---
const Food = require('./models/Food');

app.post('/api/nutrition/search', async (req, res) => {
    try {
        const { query } = req.body;
        // Search in local DB
        const foods = await Food.findAll({
            where: {
                name: {
                    [sequelize.Sequelize.Op.like]: `%${query}%`
                }
            },
            limit: 20
        });

        // If we want to fallback to openfoodfacts, we can, but let's stick to our extensive DB for now
        // or just append external results if local is empty.
        // For now, returning local matches.
        res.json(foods);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch nutrition data' });
    }
});

// --- Nutrition Log Routes ---
app.post('/api/nutrition/log', async (req, res) => {
    try {
        const { userId, date, foods } = req.body;
        // foods is an array of items
        const logs = await Promise.all(foods.map(food =>
            NutritionLog.create({
                userId,
                date,
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                quantity: food.quantity,
                image: food.image
            })
        ));
        res.json(logs);
    } catch (err) {
        console.error('Logging nutrition error:', err);
        res.status(500).json({ message: 'Failed to log nutrition' });
    }
});

app.get('/api/nutrition/log/:userId/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const logs = await NutritionLog.findAll({ where: { userId, date } });
        res.json(logs);
    } catch (err) {
        console.error('Fetch nutrition error:', err);
        res.status(500).json({ message: 'Failed to fetch nutrition log' });
    }
});

app.delete('/api/nutrition/log/:id', async (req, res) => {
    try {
        await NutritionLog.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete item' });
    }
});

// --- Dashboard Stats ---
app.get('/api/dashboard/stats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // Use local date string YYYY-MM-DD to match frontend
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        console.log(`Fetching stats for User: ${userId}, Date: ${todayStr}`);

        // 1. Calories Burned Today (From ActivityLog + Workout)
        // ActivityLog is where CalorieCalculator saves.
        const activitiesToday = await ActivityLog.findAll({
            where: {
                userId,
                date: todayStr
            }
        });

        const workoutsToday = await Workout.findAll({
            where: {
                userId,
                createdAt: {
                    [sequelize.Sequelize.Op.gte]: today
                }
            }
        });

        let caloriesBurned = 0;
        let activeMinutes = 0;

        // Sum from ActivityLog
        activitiesToday.forEach(a => {
            console.log(`Processing Activity: ${a.exerciseName}, Unit: ${a.unit}, Value: ${a.repsOrMinutes}, Date: ${a.date}`);
            caloriesBurned += a.caloriesBurned || 0;
            if (a.unit === 'minutes') {
                activeMinutes += (a.repsOrMinutes || 0);
            } else if (a.unit === 'reps') {
                // Estimate: 3 seconds per rep -> (reps * 3) / 60 minutes
                activeMinutes += (a.repsOrMinutes * 3) / 60;
            }
        });

        console.log(`Stats Calc - User: ${userId}, Date: ${today.toISOString().split('T')[0]}, Calories: ${caloriesBurned}, ActiveMin: ${activeMinutes}`);

        // Sum from Workouts (Legacy/Other source)
        workoutsToday.forEach(w => {
            caloriesBurned += w.calories || 0;
            activeMinutes += (w.duration || 0) / 60;
        });

        // 2. Streak Calculation (Consecutive days with at least 1 calorie burned from yesterday backwards)
        let streak = 0;
        const checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);
        // Check yesterday first, as 'streak' implies contiguous days ending yesterday or today.
        // If they worked out today, streak includes today. If not, we check if they kept it up until yesterday.

        // Helper to check activity on a specific date
        const hasActivityOnDate = async (d) => {
            const dateStr = d.toISOString().split('T')[0];
            const countA = await ActivityLog.count({ where: { userId, date: dateStr } });
            const countW = await Workout.count({ where: { userId, date: dateStr } });
            return (countA + countW) > 0;
        };

        // Check if active today
        let activeToday = await hasActivityOnDate(checkDate);
        if (activeToday) streak++;

        // Iterate backwards
        for (let i = 1; i <= 365; i++) { // Check up to a year
            const d = new Date();
            d.setDate(d.getDate() - i);
            const active = await hasActivityOnDate(d);
            if (active) {
                streak++;
            } else {
                // If we missed today, we might still have a streak ending yesterday?
                // Standard streak logic: if active today, standard streak.
                // If NOT active today, but active yesterday, streak is alive but 'at risk'.
                // If NOT active today AND NOT yesterday, streak is 0.
                if (!activeToday && i === 1) {
                    // Streak broken? Or do we allow "streak of 0"?
                    // Let's say if yesterday was skipped, streak is 0.
                    streak = 0;
                }
                break;
            }
        }

        res.json({
            caloriesBurned: Math.round(caloriesBurned),
            activeMinutes: Math.round(activeMinutes),
            workouts: workoutsToday.length,
            streak: streak
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
});

// --- Community ---
app.get('/api/clubs', async (req, res) => {
    const clubs = await Club.findAll();
    res.json(clubs);
});

app.get('/api/clubs/:id/members', (req, res) => {
    // Mock members
    res.json([
        { name: 'Alice', status: 'online' },
        { name: 'Bob', status: 'offline' },
        { name: 'Charlie', status: 'online' },
        { name: 'David', status: 'offline' }
    ]);
});

app.get('/api/posts', async (req, res) => {
    const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
    // Add comment count to each post
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
        const count = await Comment.count({ where: { postId: post.id } });
        return { ...post.toJSON(), commentCount: count };
    }));
    res.json(postsWithCounts);
});

app.post('/api/posts', async (req, res) => {
    const post = await Post.create({
        userId: req.body.userId, // Added userId
        userName: req.body.userName,
        userAvatar: req.body.userAvatar,
        content: req.body.content,
        image: req.body.image, // Base64 or URL
        tags: req.body.tags
    });
    res.json(post);
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { userId } = req.body; // Expect userId in body for ownership check
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Simple ownership check
        if (post.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.destroy();
        // Also delete comments
        await Comment.destroy({ where: { postId: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

app.post('/api/posts/:id/like', async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
});

// --- Comments ---
app.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { postId: req.params.id },
            order: [['createdAt', 'ARROWS' === 'DESC' ? 'DESC' : 'ASC']] // specific order
        });
        // Correcting simple order
        const sortedComments = await Comment.findAll({
            where: { postId: req.params.id },
            order: [['createdAt', 'ASC']]
        });
        res.json(sortedComments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

app.post('/api/posts/:id/comments', async (req, res) => {
    try {
        const { userId, userName, userAvatar, content, parentId } = req.body;
        const comment = await Comment.create({
            postId: req.params.id,
            userId: userId || 0, // Fallback if missing
            userName,
            userAvatar,
            content,
            parentId: parentId || null
        });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// --- Activity Log Routes ---
// Log a new exercise activity
app.post('/api/activity-log', async (req, res) => {
    try {
        const { userId, date, exerciseName, category, repsOrMinutes, unit, caloriesBurned, weightKg } = req.body;
        const activity = await ActivityLog.create({
            userId,
            date,
            exerciseName,
            category,
            repsOrMinutes,
            unit,
            caloriesBurned,
            weightKg
        });
        res.json(activity);
    } catch (err) {
        console.error('Activity log error:', err);
        res.status(500).json({ error: 'Failed to log activity' });
    }
});

// Get activity log for a specific user and date
app.get('/api/activity-log/:userId/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const activities = await ActivityLog.findAll({
            where: { userId, date },
            order: [['createdAt', 'DESC']]
        });
        res.json(activities);
    } catch (err) {
        console.error('Get activity log error:', err);
        res.status(500).json({ error: 'Failed to fetch activity log' });
    }
});

// Get total calories burned for a user on a specific date
app.get('/api/activity-log/:userId/:date/total', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const activities = await ActivityLog.findAll({
            where: { userId, date }
        });
        const totalCalories = activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);
        res.json({ totalCalories, count: activities.length });
    } catch (err) {
        console.error('Get total calories error:', err);
        res.status(500).json({ error: 'Failed to calculate total calories' });
    }
});

// Get activity stats for radar chart (last 7 days by category)
app.get('/api/dashboard/activity/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // 1. Fetch ActivityLogs
        const activities = await ActivityLog.findAll({
            where: {
                userId,
                date: { [sequelize.Sequelize.Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
            }
        });

        // 2. Fetch Workouts
        const workouts = await Workout.findAll({
            where: {
                userId,
                date: { [sequelize.Sequelize.Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
            }
        });

        // 3. Fetch NutritionLogs
        const nutrition = await NutritionLog.findAll({
            where: {
                userId,
                date: { [sequelize.Sequelize.Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
            }
        });

        // 4. Initialize Map for last 7 dates
        const dayMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            dayMap[dateStr] = { name: dayName, calories: 0, workout: 0, date: dateStr }; // calories = consumed, workout = burned
        }

        // 5. Aggregate Data
        // Calories Burned (Workout + ActivityLog) -> stored in 'workout' field for Graph
        activities.forEach(a => {
            const d = a.date;
            if (dayMap[d]) dayMap[d].workout += (a.caloriesBurned || 0);
        });
        workouts.forEach(w => {
            const d = w.date;
            if (dayMap[d]) dayMap[d].workout += (w.calories || 0);
        });

        // Calories Consumed (NutritionLog) -> stored in 'calories' field for Graph
        nutrition.forEach(n => {
            const d = n.date;
            if (dayMap[d]) dayMap[d].calories += (n.calories || 0);
        });

        // 6. Convert to Array and Sort
        const graphData = Object.values(dayMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(graphData);
    } catch (err) {
        console.error('Graph data error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Get activity stats for radar chart (last 7 days by category)
app.get('/api/activity-log/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const activities = await ActivityLog.findAll({
            where: {
                userId,
                date: { [sequelize.Sequelize.Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
            }
        });

        // Group by category
        const stats = {
            'Cardio': 0, 'Strength': 0, 'Flexibility': 0,
            'Endurance': 0, 'Balance': 0, 'Power': 0
        };

        activities.forEach(activity => {
            let cat = activity.category || 'Other';
            if (cat === 'Legs' || cat === 'Chest' || cat === 'Back' || cat === 'Arms' || cat === 'Shoulders') cat = 'Strength';
            if (cat === 'Yoga') cat = 'Flexibility';

            if (stats[cat] !== undefined) {
                stats[cat] += (activity.caloriesBurned || 0);
            }
        });

        const radarData = Object.keys(stats).map(key => ({
            subject: key,
            A: Math.min(100, (stats[key] / 1000) * 100), // Cap at 100%
            fullMark: 100
        }));

        res.json(radarData);
    } catch (err) {
        console.error('Radar stats error:', err);
        res.status(500).json({ error: 'Failed to fetch radar stats' });
    }
});

// --- Health Check & Test Endpoints ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Backend is reachable and working!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
