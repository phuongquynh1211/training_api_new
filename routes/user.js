const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user"); 
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
try {
const { username, email, password } = req.body;
if (await User.findOne({ email })) return res.status(400).json({ message: "Email has been used" });
const newUser = new User({ username, email, password });
await newUser.save();
console.log(`Verify Email: http://yourfrontend.com/verify-email?token=${newUser._id}`);
res.json({ message: "Registered successfully. Please verify your email." });

} catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
});

// Xác thực email
router.post("/verify-email", async (req, res) => {
    try {
    const { token } = req.body;
    const user = await User.findById(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "Email verified successfully" });
    
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    
    //Login
    router.post("/login", async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(400).json({ message: "Invalid credentials" });
    const accessToken = uuidv4();
    user.accessToken = accessToken;
    await user.save();
    res.json({ message: "Login successful", accessToken });
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    
    //Logout
    router.post("/logout", async (req, res) => {
    try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.accessToken = null;
    await user.save();
    res.json({ message: "Logged out successfully" });
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    // Update profile
router.put("/update-profile", async (req, res) => {
    try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate({ email }, { username }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
// Yêu cầu đặt lại mật khẩu
router.post("/request-reset-password", async (req, res) => {
    try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(`Reset Password Link: http://yourfrontend.com/reset-password?token=${user._id}`);
    res.json({ message: "Password reset email simulated. Check console log." });
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    
    // Quên mật khẩu
    router.post("/reset-password", async (req, res) => {
    try {
    const { token, newPassword } = req.body;
    const user = await User.findById(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    
    // Gửi lại email xác thực
    router.post("/resend-verification", async (req, res) => {
    try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(`Resend Email Verification Link: http://yourfrontend.com/verify-email?token=${user._id}`);
    res.json({ message: "Resend verification email simulated. Check console log." });
    } catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
    });
    module.exports = router;