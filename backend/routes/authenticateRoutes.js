const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const connection = require('../db');

const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(express.json());
const JWT_SECRET = process.env.SECRET_KEY;


// Contains subroutes of '/authenticate' route

//accepts firstName,username,email,password,dateOfBirt and creates a new user.

// signup route for registration
router.post('/signup', [
    // Validating API inputs
    body('name', 'at least 3 characters required').isLength({ min: 3 }),
    body('email', 'invalid').isEmail(),
    body('password').optional()
        .isLength({ min: 8 }).withMessage('at least 8 characters required')
        .matches(/[A-Z]/).withMessage('must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('must contain at least one special character')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => {
                    return { path: error.path, message: error.msg }
                })
            });
        }

        // Destructuring req.body
        const { name, email, password } = req.body;


        // Generating salt and hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const id = uuidv4();

        connection.query("insert into user (id, name,  email_id, password) values (?, ?, ?, ?)", [id, name, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Failed to create user' });
            }
            console.log(results);


            const payload = {
                user: {
                    id: id
                }
            };
            const authToken = jwt.sign(payload, JWT_SECRET);

            // Sending response
            res.status(201).json({ auth_token: authToken });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
});

// '/login' route for logging in the user
router.post('/signin', [
    body('email', 'invalid').isEmail(),
    body('password', 'at least 8 characters required').isLength({ min: 4 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(error => {
                return { path: error.path, message: error.msg }
            })
        });
    }

    const { email, password } = req.body;

    try {

        connection.query("SELECT * FROM user WHERE email_id= ?", [email], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0)
                return res.status(400).json({ path: "username", message: 'invalid' });


            // Compare passwords using bcrypt.compare()
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) {
                    throw err; // Handle the error
                }
                if (isMatch) {
                    const payload = {
                        user: {
                            id: results[0].id
                        }
                    };
                    const authToken = jwt.sign(payload, JWT_SECRET);
                    res.status(200).json({ auth_token: authToken });
                } else {
                    res.status(400).json({ path: "password", message: 'invalid' });
                }
            });

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });;
    }
});
router.get('/getusers', (req, res) => {
    // Assuming req.user contains the user ID from the JWT token
    const userId = req.user.id; // Extract user ID from the request object

    connection.query("SELECT * FROM user WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});

module.exports = router