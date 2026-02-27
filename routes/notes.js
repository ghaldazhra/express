import { Router } from "express";
import { Post } from "../models/index.js"; // Pastikan import model Post yang benar

const router = Router();

// GET ALL
router.get("/", async (req, res, next) => {
  try {
    const notes = await Post.find(); // Mengambil semua data
    console.log(notes);
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

// GET BY ID
router.get("/:id", async (req, res, next) => {
  try {
    const note = await Post.findById(req.params.id); // Mencari berdasarkan ID MongoDB
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (e) {
    next(e);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  try {
    // Menggunakan Post.create() sesuai gambar materi kamu
    const note = await Post.create({ title, content, author });
    res.status(201).json(note);
  } catch (e) {
    next(e);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  const { title, content, author } = req.body;

  try {
    // { new: true } agar yang dikembalikan adalah data yang sudah diupdate
    const note = await Post.findByIdAndUpdate(
      req.params.id, 
      { title, content, author },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (e) {
    next(e);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const note = await Post.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted successfully" });
  } catch (e) {
    next(e);
  }
});

export default router;