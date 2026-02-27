import express from "express";
import { Post } from "../models/index.js";

const router = express.Router();

// GET ALL notes
router.get("/", async (req, res) => {
  try {
    const notes = await Post.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const note = await Post.findById(id);

    if (!note) return res.status(404).json({ message: "Not found" });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE note
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const newNote = await Post.create({
      title: title.trim(),
      content,
      author,
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE by title
router.put("/title/:title", async (req, res) => {
  try {
    const title = req.params.title.trim();

    // Jika ingin mengupdate title juga, pastikan title baru di-trim
    if (req.body.title) {
      req.body.title = req.body.title.trim();
    }

    const updatedNote = await Post.findOneAndUpdate(
      { title: title }, // Mencari berdasarkan title lama
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Not found" });

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE by title
router.delete("/title/:title", async (req, res, next) => {
  try {
    const deleted = await Post.findOneAndDelete({ title: req.params.title.trim() });
    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;