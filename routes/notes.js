import express, { application } from "express";
import { Post } from "../models/index.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// GET ALL notes
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Post.find({ user: req.user.id }); // Hanya mengambil catatan milik user yang sedang login
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by id
router.get("/:id", auth, async (req, res) => {
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
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const newNote = await Post.create({
      title: title.trim(),
      content,
      author,
      user: req.user.id, // Mengaitkan catatan dengan user yang membuatnya
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE by title
router.put("/title/:title", auth, async (req, res) => {
  try {
    const title = req.params.title.trim();

    // Jika ingin mengupdate title juga, pastikan title baru di-trim
    if (req.body.title) {
      req.body.title = req.body.title.trim();
    }

    const updatedNote = await Post.findOneAndUpdate(
      { title: title, user: req.user.id }, // Mencari berdasarkan title lama dan user yang sedang login
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
router.delete("/title/:title", auth, async (req, res, next) => {
  try {
    const deleted = await Post.findOneAndDelete({ title: req.params.title.trim(), user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;