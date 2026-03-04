import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.js";
import sendEmail from "../utils/sendMail.js";

const router = express.Router();

// register email langsung aktif tanpa verifikasi
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Buat user (langsung aktif)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true
    });

    await sendEmail({
      email: user.email,
      subject: "Signup Berhasil",
      message: `Halo ${user.name}, akun kamu berhasil dibuat pada ${new Date().toISOString()}.`,
      html: `
        <h2>Signup Berhasil</h2>
        <p>Halo ${user.name},</p>
        <p>Akun kamu berhasil dibuat pada ${new Date().toISOString()}.</p>
      `
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// login terverivikasi 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// uses auth middleware
router.get("/protected", auth, (req, res) => {
  res.json({
    message: "You are authorized!",
    user: req.user
  });
});


// get all users
router.get("/all", async (req, res) => {
  try {
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