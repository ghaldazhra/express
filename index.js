import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",    
}
));

app.use(express.json());

app.use("/notes", notesRouter);

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});