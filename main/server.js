require('dotenv').config();
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Avoid creating sessions for unauthenticated users
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session lasts for 24 hours
}));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // For parsing form data

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // User is authenticated, proceed
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
}

// Routes
app.get('/', (req, res) => {
    res.redirect('/login'); // Default route redirects to login
});

// Login route
app.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard'); // Redirect logged-in users to dashboard
    }
    res.render('login', { error: null }); // Show login page
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && bcrypt.compareSync(password, user.password_hash)) {
            req.session.userId = user.id;
            res.redirect('/dashboard'); // Redirect to dashboard after successful login
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

// Register route (GET)
app.get('/register', (req, res) => {
    res.render('register', { error: null }); // Render the registration page
});

// Register route (POST)
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, terms } = req.body;

    try {
        // 1. Check if the user agreed to terms
        if (!terms) {
            return res.render('register', { error: 'You must agree to the terms and policies.' });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('register', { error: 'Invalid email format.' });
        }

        // 3. Enforce password complexity
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.render('register', {
                error: 'Password must be at least 8 characters long, include 1 uppercase letter, and 1 number.',
            });
        }

        // 4. Check if passwords match
        if (password !== confirmPassword) {
            return res.render('register', { error: 'Passwords do not match.' });
        }

        // 5. Check if username or email already exists in the database
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );
        if (existingUser.rows.length > 0) {
            return res.render('register', { error: 'Username or email already exists.' });
        }

        // 6. Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // 7. Insert the new user into the database
        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        // 8. Redirect to the login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'An error occurred. Please try again.' });
    }
});

// Dashboard route
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Welcome to PharmaSim Dashboard!'); // Replace with your dashboard content
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard'); // Redirect back to dashboard on error
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/login'); // Redirect to login after logout
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
