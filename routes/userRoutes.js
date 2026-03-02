import express from "express";
import User from "../models/user.js";

const router = express.Router();

// 1. ROUTE REGISTER
// Digunakan untuk mendaftarkan akun baru
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Mengecek apakah email sudah terdaftar sebelumnya
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. ROUTE LOGIN
// Digunakan untuk masuk ke akun yang sudah ada
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Membandingkan password input dengan password di database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. ROUTE GET ALL USERS
// Digunakan untuk melihat daftar akun yang sudah registrasi
router.get("/all", async (req, res) => {
  try {
    // .select("-password") memastikan password tidak bocor ke publik demi keamanan
    const users = await User.find({}).select("-password");
    
    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;