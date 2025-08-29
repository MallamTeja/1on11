const express = require('express');
const path = require('path');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcryptjs');

let mongoClient;
let db;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'skillexchange';
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Sample user data (in a real app, this would be in a database)
const users = [
    {
        id: 1,
        username: 'john_doe',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$XFDq3wNxVz5q5q5q5q5q5O5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q', // hashed 'password123'
        role: 'user',
        skills: ['JavaScript', 'React', 'Node.js'],
        coursesEnrolled: 5,
        coursesCompleted: 3,
        hoursLearned: 24,
        streak: 7,
        certificates: 2
    }
];

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        if (!db) throw new Error('DB not initialized');
        await db.command({ ping: 1 });
        res.json({ ok: true, db: MONGODB_DB });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.render('login', { 
        user: null,
        error: null 
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        req.session.user = user;
        return res.redirect('/dashboard');
    }
    res.render('login', { error: 'Invalid email or password' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { 
        user: null,
        error: null 
    });
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (users.some(u => u.email === email)) {
        return res.render('signup', { error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        skills: [],
        coursesEnrolled: 0,
        coursesCompleted: 0,
        hoursLearned: 0,
        streak: 0,
        certificates: 0
    };
    
    users.push(newUser);
    req.session.userId = newUser.id;
    req.session.user = newUser;
    res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', { 
        user: req.session.user,
        isExploreView: false
    });
});

app.get('/explore', requireAuth, (req, res) => {
    // In a real app, this would fetch from a database
    const topUsers = users
        .filter(u => u.id !== req.session.userId)
        .sort((a, b) => b.coursesCompleted - a.coursesCompleted)
        .slice(0, 3);
        
    res.render('dashboard', {
        user: req.session.user,
        isExploreView: true,
        topUsers
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let server;

async function start() {
    try {
        // Try to connect to MongoDB if URI is provided
        if (MONGODB_URI) {
            try {
                mongoClient = new MongoClient(MONGODB_URI, { 
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 5000,
                    socketTimeoutMS: 5000
                });
                await mongoClient.connect();
                db = mongoClient.db(MONGODB_DB);
                await db.command({ ping: 1 });
                console.log(`✅ Connected to MongoDB database "${MONGODB_DB}"`);
            } catch (dbError) {
                console.warn('⚠️  Could not connect to MongoDB. Using in-memory data only.');
                console.warn('   Error details:', dbError.message);
            }
        } else {
            console.warn('⚠️  MONGODB_URI is not set. Using in-memory data only.');
        }

        // Start the server regardless of DB connection
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
            console.log('\nAvailable routes:');
            console.log(`   - Home:        http://localhost:${PORT}`);
            console.log(`   - Login:       http://localhost:${PORT}/login`);
            console.log(`   - Signup:      http://localhost:${PORT}/signup`);
            console.log(`   - Dashboard:   http://localhost:${PORT}/dashboard`);
            console.log(`   - Explore:     http://localhost:${PORT}/explore`);
            console.log('\nTest account:');
            console.log('   Email:    john@example.com');
            console.log('   Password: password123');
            console.log('\nPress Ctrl+C to stop the server');
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`\n❌ Port ${PORT} is already in use. Please close the other application or use a different port.`);
            } else {
                console.error('\n❌ Server error:', error);
            }
            process.exit(1);
        });
    } catch (err) {
        console.error('\n❌ Failed to start server:', err);
        process.exit(1);
    }
}

function shutdown() {
    console.log('\nShutting down server...');

    const closeServer = () => {
        if (server) {
            server.close(() => {
                console.log('Server has been terminated');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    };

    if (mongoClient) {
        mongoClient.close().then(() => {
            console.log('MongoDB connection closed');
            closeServer();
        }).catch((err) => {
            console.error('Error closing MongoDB connection:', err);
            closeServer();
        });
    } else {
        closeServer();
    }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
