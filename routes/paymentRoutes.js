import express from 'express';
import {
    createTransaction,
    handleNotification,
    checkStatus
} 
from '../midtrans.js';

const router = express.Router();

// Route untuk membuat transaksi
router.post("/create", createTransaction);

// Route untuk menerima notifikasi dari Midtrans
router.post("/notification", handleNotification);

// endpoint cek statsus transaksi
router.get("/status/:orderId", checkStatus);

export default router;