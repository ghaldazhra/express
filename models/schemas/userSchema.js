// models/schemas/userSchema.js
import mongoose from "mongoose";
import crypto from "crypto";

const { Schema } = mongoose;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

// VERSI ANTI-ERROR: Hapus 'next' dan jangan dipanggil di dalam
UserSchema.pre("save", function () { 
  if (!this.isModified("password")) return;

  try {
    this.password = hashPassword(this.password);
    // Tanpa next() di sini
  } catch (error) {
    throw new Error("Gagal hashing password");
  }
});

UserSchema.methods.comparePassword = function (inputPassword) {
  return hashPassword(inputPassword) === this.password;
};

export default UserSchema;