require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors({
    origin: '*' // Replace with your frontend's URL in production
}));

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0].now);
    }
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Session lasts for 24 hours
        httpOnly: true, // Makes the cookie accessible only through HTTP(S)
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    },
}));

// Middleware
app.use(express.urlencoded({ extended: false })); // For parsing form data
app.use(express.json()); // For parsing JSON data in requests

// In a production environment, serve the built React app from the 'client/build' directory
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
}

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' }); // Return 401 for unauthorized API requests
    }
}

// Routes

// Serve the React app for logged-in users in production
if (process.env.NODE_ENV === 'production') {
    app.get('/', isAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

app.get('/login', (req, res) => {
    // In production, you'd redirect to the React app's login route
    // For development, you might serve a simple login page
    if (process.env.NODE_ENV === 'production') {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html')); // Ensure this path is correct
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username.trim()]);
        const user = result.rows[0];

        if (user && bcrypt.compareSync(password, user.password_hash)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            // Send a success response that the frontend can handle
            res.status(200).json({ message: 'Login successful', redirect: '/operations' });
        } else {
            // Send an error message that the frontend can display
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        // Send a generic error message
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

app.get('/register', (req, res) => {
    // In production, you'd redirect to the React app's register route
    // For development, you might serve a simple registration page
    if (process.env.NODE_ENV === 'production') {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'register.html')); // Ensure this path is correct
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, terms } = req.body;

    try {
        if (!terms) {
            return res.status(400).json({ error: 'You must agree to the terms and policies.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long, include 1 uppercase letter, and 1 number.',
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match.' });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username.trim(), email.trim()]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username.trim(), email.trim(), hashedPassword]
        );

        // Send a success response
        res.status(201).json({ message: 'Registration successful', redirect: '/login' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        // Send a success response
        res.status(200).json({ message: 'Logout successful', redirect: '/login' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Page not found' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// The "catchall" handler: for any request that doesn't
// match an API route, send back the React index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Import and use API routes
const employeesRoutes = require('./api/employeesapi');
// const productsRoutes = require('./api/productsapi');
// ... (import and use other API route files as you create them)

app.use('/api/employees', employeesRoutes);
// app.use('/api/products', productsRoutes);
// ... (mount other API routes)

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});