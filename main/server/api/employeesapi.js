const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection pool (you might want to move this to a separate db.js file later)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET all employees
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST create a new employee
router.post('/', async (req, res) => {
    try {
        const { id, firstName, lastName, role, salary, morale, mood, hireDate, currentTaskId, skills } = req.body;

        // Basic validation (you'd want more robust validation in a real app)
        if (!id || !firstName || !lastName || !role || !salary || !morale || !hireDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            'INSERT INTO employees (id, firstName, lastName, role, salary, morale, mood, hireDate, currentTaskId, skills) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [id, firstName, lastName, role, salary, morale, mood, hireDate, currentTaskId, JSON.stringify(skills)]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error during employee creation' });
    }
});

// PUT update an employee
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, role, salary, morale, mood, hireDate, currentTaskId, skills } = req.body;

        const result = await pool.query(
            'UPDATE employees SET firstName = $1, lastName = $2, role = $3, salary = $4, morale = $5, mood = $6, hireDate = $7, currentTaskId = $8, skills = $9 WHERE id = $10 RETURNING *',
            [firstName, lastName, role, salary, morale, mood, hireDate, currentTaskId, JSON.stringify(skills), id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error during employee update' });
    }
});

// DELETE an employee
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        if (result.rowCount === 1) {
            res.status(204).send(); // No Content (successful deletion)
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;