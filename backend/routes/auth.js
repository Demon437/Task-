const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashed });
        await newUser.save();

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("Login attempt:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login Error:", err);  // <--- SHOW FULL ERROR
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;
