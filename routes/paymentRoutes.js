import express from 'express';
import {
    createTransaction,
    handleNotification
} 
from '../midtrans.js';

const router = express.Router();

// Route untuk membuat transaksi
router.post("/create", createTransaction);

// Route untuk menerima notifikasi dari Midtrans
router.post("/notification", handleNotification);

export default router;