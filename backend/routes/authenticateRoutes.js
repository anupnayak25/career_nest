const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const connection = require('../db');
const fetchUser = require('../middlewares/fetchUser');

const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.use(express.json());
const JWT_SECRET = process.env.SECRET_KEY;


// Contains subroutes of '/authenticate' route

//accepts firstName,username,email,password,dateOfBirt and creates a new user.

router.post('/otp', [// Validating API inputs 
    body('email', 'invalid').isEmail(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(error => {
                    return { path: error.path, message: error.msg }
                })
            });
        }

        const { email } = req.body;

        /*TODO: code to send otp*/
        const otp = "000000";

        connection.query("insert into otps (email_id, otp_code) values (?,?)", [email, otp], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(429).json({ error: 'Try again later' });
            }
            else {
                res.status(201).json({ message: "Otp sent successfully" });
            }
        });



    } catch (e) {

    }
});

// signup route for registration
router.post('/signup',
    [
        // Validating API inputs
        body('email', 'invalid').isEmail(),
        body('otp')
            .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
            .isNumeric().withMessage('OTP must contain only numbers'),
        body('password')
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
            const { otp, email, password } = req.body;


            // Generating salt and hashing password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const id = uuidv4();

            connection.query("select otp_code from otps where email_id = ?", [email], (err, results) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Failed to fetch otp' });
                }
                else if (results.length == 0) {
                    return res.status(406).json({ error: 'OTP not generated' });
                }
                else if (otp == results[0].otp_code) {

                    //eextracting name before @ symbol from email
                    const name = email.split('@')[0];
                    connection.query("insert into user (id, name,  email_id, password) values (?, ?, ?, ?)", [id, name, email, hashedPassword], (err, results) => {
                        if (err) {
                            console.error('Error inserting user:', err);
                            return res.status(500).json({ error: 'Failed to create user' });
                        }
                        const payload = {
                            user: {
                                id: id
                            }
                        };
                        const authToken = jwt.sign(payload, JWT_SECRET);

                        // Sending response
                        res.status(201).json({
                            auth_token: authToken,
                            name: name,
                            email: email
                        });
                    });

                }
                else {
                    return res.status(403).json({ error: 'OTP did not matched' });
                }
            })

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
                    res.status(200).json({
                        auth_token: authToken,
                        name: results[0].name,
                        email: email
                    });
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

//forget password
router.put('/forgot',[
        // Validating API inputs
        body('email', 'invalid').isEmail(),
        body('otp')
            .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
            .isNumeric().withMessage('OTP must contain only numbers'),
        body('password')
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
            const { otp, email, password } = req.body;


            // Generating salt and hashing password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const id = uuidv4();

            connection.query("select otp_code from otps where email_id = ?", [email], (err, results) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Failed to fetch otp' });
                }
                else if (results.length == 0) {
                    return res.status(406).json({ error: 'OTP not generated' });
                }
                else if (otp == results[0].otp_code) {

                    //eextracting name before @ symbol from email
                    const name = email.split('@')[0];
                    connection.query("update user set password = ? where email_id = ?", [hashedPassword, email], (err, results) => {
                        if (err) {
                            console.error('Error inserting user:', err);
                            return res.status(500).json({ error: 'Failed to create user' });
                        }
                        const payload = {
                            user: {
                                id: id
                            }
                        };
                        const authToken = jwt.sign(payload, JWT_SECRET);

                        // Sending response
                        res.status(201).json({
                            auth_token: authToken,
                            name: name,
                            email: email
                        });
                    });

                }
                else {
                    return res.status(403).json({ error: 'OTP did not matched' });
                }
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error" });
        }
    });

router.get('/getusers', fetchUser, (req, res) => {
    // Assuming req.user contains the user ID from the JWT token
    const userId = req.user.id; // Extract user ID from the request object

    if(req.user.type=="student"){
        return res.status(401).json({
            message:"not allowed!"
        });
    }

    connection.query("SELECT name, email_id, type FROM user WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});


module.exports = router