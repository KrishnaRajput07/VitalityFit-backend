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

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
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

// --- Dashboard Stats ---
app.get('/api/dashboard/stats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Calories Burned Today
        // Mocking: Sum of workouts today (if we had calories in workout model)
        // For now, let's just count workouts today * arbitrary burn or use the float field if populated
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

        workoutsToday.forEach(w => {
            caloriesBurned += w.calories || 0; // Assuming calories field exists or defaults
            activeMinutes += (w.duration || 0) / 60; // Assuming duration is seconds
        });

        // 2. Streak
        // Simple logic: Count consecutive days with at least one workout backwards from today
        // (This is a simplified version, real streak logic is complex)
        // Let's just return a placeholder or 0 if no workouts
        const streak = 0; // basic placeholder for now unless we implement full logic

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
    res.json(posts);
});

app.post('/api/posts', async (req, res) => {
    const post = await Post.create({
        userName: req.body.userName,
        userAvatar: req.body.userAvatar,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    });
    res.json(post);
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
        const { userName, userAvatar, content, parentId } = req.body;
        const comment = await Comment.create({
            postId: req.params.id,
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
app.get('/api/activity-log/:userId/stats', async (req, res) => {
    try {
        const { userId } = req.params;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activities = await ActivityLog.findAll({
            where: {
                userId,
                date: {
                    [sequelize.Sequelize.Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
                }
            }
        });

        // Group by category
        const stats = {};
        activities.forEach(activity => {
            const cat = activity.category || 'Other';
            if (!stats[cat]) stats[cat] = 0;
            stats[cat] += activity.caloriesBurned;
        });

        res.json(stats);
    } catch (err) {
        console.error('Get activity stats error:', err);
        res.status(500).json({ error: 'Failed to fetch activity stats' });
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
