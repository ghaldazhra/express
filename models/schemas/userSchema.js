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
  
  // Field verifikasi harus di dalam objek utama Schema
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String }, 
  verifyTokenExpire: { type: Date }
}, 
{ timestamps: true });

// Middleware Pre-Save
// Catatan: Gunakan function reguler (bukan arrow function) agar 'this' merujuk ke dokumen
UserSchema.pre("save", function (next) { 
  if (!this.isModified("password")) return;

  try {
    this.password = hashPassword(this.password);
  } catch (error) {
    throw new Error("Error hashing password");
  }
});

// Method untuk cek password
UserSchema.methods.comparePassword = function (inputPassword) {
  return hashPassword(inputPassword) === this.password;
};

// Method untuk generate token verifikasi
UserSchema.methods.generateVerificationToken = function() {
  // Buat string acak
  const rawToken = crypto.randomBytes(32).toString("hex");
  
  // Hash token tersebut agar yang tersimpan di DB lebih aman
  this.verifyToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  
  // Set kadaluarsa (misal 24 jam)
  this.verifyTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

  return rawToken; // Kembalikan token asli (unhashed) untuk dikirim ke email
};

export default UserSchema;