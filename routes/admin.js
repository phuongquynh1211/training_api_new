const express = require("express");
const User = require("../models/user"); 
const mongoose = require("mongoose");
const router = express.Router();


// Lấy thông tin user
router.get("/infor", async (req, res) => {
try {
const { email } = req.query;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: "User not found" });
res.json(user);
} catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
});



// Lấy danh sách users 
router.get("/users", async (req, res) => {
try {
const users = await User.find();
res.json(users);
} catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
});


module.exports = router;
