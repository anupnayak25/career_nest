const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const connection = require("../db");
const fetchUser = require("../middlewares/fetchUser");

const { v4: uuidv4 } = require("uuid");

const router = express.Router();
router.use(express.json());
const JWT_SECRET = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const { Console } = require("console");

// Replace with your actual email and app password
const EMAIL = "nnm24mc014@nmamit.in";
const APP_PASSWORD = "rwmw shug bfqr nyyd";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Fix self-signed cert error
  },
  //   logger: true,
  //   debug: true,
});

// In-memory store: { [email]: otp }
const otpStore = {};
const verifiedEmails = new Set();

router.post("/otp", [body("email", "Invalid email").isEmail()], async (req, res) => {
  console.log("OTP request received for email:", req.body.email);
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

  // Store OTP in memory (will be lost if server restarts)
  otpStore[email] = otpCode;

  const mailOptions = {
    from: "carriernestinfo@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otpCode}\n\nPlease do not share this with anyone.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully", info });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP", error });
  }
});

router.post(
  "/verify-otp",
  [
    body("email", "Invalid email").isEmail(),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .isNumeric()
      .withMessage("OTP must contain only numbers"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => ({
            path: error.path,
            message: error.msg,
          })),
        });
      }

      const { email, otp } = req.body;
      const storedOtp = otpStore[email];

      if (!storedOtp) {
        return res.status(406).json({ error: "OTP not generated" });
      }

      if (otp !== storedOtp) {
        return res.status(403).json({ error: "OTP did not match" });
      }

      // SUCCESS: OTP verified
      verifiedEmails.add(email);
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/signup",
  [
    // Validating API inputs
    body("email", "Invalid email").isEmail(),
    body("password")
      .isLength({ min: 4 })
      .withMessage("At least 4 characters required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => ({
            path: error.path,
            message: error.msg,
          })),
        });
      }

      const { name, email, password, userType } = req.body;

      if (!verifiedEmails.has(email)) {
        return res.status(403).json({ error: "OTP not verified" });
      }
      // Validate OTP from in-memory store
      // const [existingUsers] = await connection.query("SELECT * FROM user WHERE email_id = ?", [email]);
      // if (existingUsers.length > 0) {
      //   return res.status(409).json({ message: "User already exists" });
      // }
      // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

      // Extract year from email
      // let year = null;
      // if (userType === 'student') {
      //   // Extract year from email pattern like nnm24mc014@nmamit.in
      //   const emailMatch = email.match(/nnm(\d{2})/i);
      //   if (emailMatch) {
      //     const yearSuffix = parseInt(emailMatch[1]);
      //     // Convert 24 to 2024, 25 to 2025, etc.
      //     year = yearSuffix < 50 ? 2000 + yearSuffix : 1900 + yearSuffix;
      //   }
      // }
      // For faculty or if year extraction fails, year remains null

      // Insert user into database
      connection.query(
        "INSERT INTO user (name, email_id, password, type) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, userType],
  (err, results) => {
          if (err) {
            // Duplicate entry error (email already exists)
            if (err.code === "ER_DUP_ENTRY") {
              console.error("Duplicate entry for email:", email);
              // Clean up OTP/verification state and respond with conflict
              delete otpStore[email];
              verifiedEmails.delete(email);
              return res
                .status(409)
                .json({ error: "User already exists", message: "User already exists" }); // 409 Conflict
            }

            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Failed to create user" });
          }

          // Remove used OTP
          delete otpStore[email];
          verifiedEmails.delete(email);
          // Generate auth token with DB user id
          const userId = results.insertId; // auto-increment id from DB
          const payload = {
            user: {
              id: userId,
            },
          };
          const authToken = jwt.sign(payload, JWT_SECRET);

          // Send response

          res.status(201).json({
            auth_token: authToken,
            name,
            email,
            type: userType,
            id: userId,
          });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/signin",
  [body("email", "invalid").isEmail(), body("password", "at least 4 characters required").isLength({ min: 4 })],
  async (req, res) => {
    // console.log("signin route hit");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((error) => ({
          path: error.path,
          message: error.msg,
        })),
      });
    }

    const { email, password } = req.body;

    try {
      const [results] = await connection.promise().query("SELECT * FROM user WHERE email_id = ?", [email]);

      if (results.length === 0) {
        return res.status(400).setHeader('Content-Type', 'application/json').json({ path: "email", message: "Account not found" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).setHeader('Content-Type', 'application/json').json({ path: "password", message: "Incorrect password" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);

      return res.status(200).setHeader('Content-Type', 'application/json').json({
        auth_token: authToken,
        name: user.name,
        email: user.email_id,
        type: user.type,
        id: user.id,
      });
    } catch (error) {
      console.error("Signin error:", error);
      return res.status(500).setHeader('Content-Type', 'application/json').json({ message: "Internal server error" });
    }
  }
);

module.exports = router;

//forget password
router.put(
  "/forgot",
  [
    // Validating API inputs
    body("email", "invalid").isEmail(),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
      .isNumeric()
      .withMessage("OTP must contain only numbers"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("at least 8 characters required")
      .matches(/[A-Z]/)
      .withMessage("must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("must contain at least one number")
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
      .withMessage("must contain at least one special character"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((error) => {
            return { path: error.path, message: error.msg };
          }),
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
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Failed to fetch otp" });
        } else if (results.length == 0) {
          return res.status(406).json({ error: "OTP not generated" });
        } else if (otp == results[0].otp_code) {
          //eextracting name before @ symbol from email
          const name = email.split("@")[0];
          connection.query(
            "update user set password = ? where email_id = ?",
            [hashedPassword, email],
            (err, results) => {
              if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Failed to create user" });
              }
              const payload = {
                user: {
                  id: id,
                },
              };
              const authToken = jwt.sign(payload, JWT_SECRET);

              // Sending response
              res.status(201).json({
                auth_token: authToken,
                name: name,
                email: email,
              });
            }
          );
        } else {
          return res.status(403).json({ error: "OTP did not matched" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  }
);

router.get("/getusers", fetchUser, (req, res) => {
  // Assuming req.user contains the user ID from the JWT token
  const userId = req.user.id; // Extract user ID from the request object

  if (req.user.type == "student") {
    return res.status(401).json({
      message: "not allowed!",
    });
  }

  connection.query("SELECT name, email_id, type FROM user WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// Update user details (name, email, etc.)
router.put(
  "/update-details",
  fetchUser,
  [
    body("name", "Name is required").optional().notEmpty(),
    body("email", "Invalid email").optional().isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email } = req.body;
    const userId = req.user.id;

    connection.query(
      "UPDATE user SET name = ?, email_id = ? WHERE id = ?",
      [name || null, email || null, userId],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User details updated successfully" });
      }
    );
  }
);

// Update user password
router.put(
  "/update-password",
  fetchUser,
  [
    body("oldPassword", "Old password is required").notEmpty(),
    body("newPassword", "New password must be at least 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const [results] = await connection.promise().query("SELECT password FROM user WHERE id = ?", [userId]);
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(oldPassword, results[0].password);
      if (!isMatch) {
        return res.status(403).json({ error: "Old password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      connection.query(
        "UPDATE user SET password = ? WHERE id = ?",
        [hashedPassword, userId],
        (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Password updated successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
