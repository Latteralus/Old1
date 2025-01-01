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
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Session lasts for 24 hours
}));

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // For parsing form data

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username.trim()]);
        const user = result.rows[0];

        if (user && bcrypt.compareSync(password, user.password_hash)) {
            req.session.userId = user.id;
            req.session.username = user.username;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, terms } = req.body;

    try {
        if (!terms) {
            return res.render('register', { error: 'You must agree to the terms and policies.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.render('register', { error: 'Invalid email format.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.render('register', {
                error: 'Password must be at least 8 characters long, include 1 uppercase letter, and 1 number.',
            });
        }

        if (password !== confirmPassword) {
            return res.render('register', { error: 'Passwords do not match.' });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username.trim(), email.trim()]
        );
        if (existingUser.rows.length > 0) {
            return res.render('register', { error: 'Username or email already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
            [username.trim(), email.trim(), hashedPassword]
        );

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'An error occurred. Please try again.' });
    }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.session.username });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
