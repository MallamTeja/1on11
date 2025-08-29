const express = require('express');
const path = require('path');
require('dotenv').config();
const { MongoClient } = require('mongodb');

let mongoClient;
let db;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'skillexchange';
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001; // Using 3001 to avoid conflicts

// Serve static files from the current directory
app.use(express.static(__dirname));

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

// Handle all other routes by serving index.html (Express 5-compatible catch-all)
app.get('/:path(*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let server;

async function start() {
    try {
        if (!MONGODB_URI) {
            console.warn('MONGODB_URI is not set. Skipping database connection.');
        } else {
            mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
            await mongoClient.connect();
            db = mongoClient.db(MONGODB_DB);
            await db.command({ ping: 1 });
            console.log(`Connected to MongoDB database "${MONGODB_DB}"`);
        }

        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Frontend server running on http://localhost:${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please close the other application or use a different port.`);
            } else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
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
