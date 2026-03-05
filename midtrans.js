import "dotenv/config";
import midtrans from "midtrans-client";

const snap = new midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const coreApi = new midtrans.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
})

// buat transaksi
export const createTransaction = async (req, res) => {
    try { 
        const { amount, first_name, email } = req.body;

        const parameter = {
            transaction_details: {
                order_id: "ORDER-" + Date.now(),
                gross_amount: amount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name,
                email
            }
        };

        const transaction = await snap.createTransaction(parameter);

        res.status(200).json({
            message: "Transaction created successfully",
            token: transaction.token,
            redirect_url: transaction.redirect_url
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Failed to create transaction" });
        console.log("Server Key Check:", process.env.MIDTRANS_SERVER_KEY);
    }   
};

// handle notifikasi
export const handleNotification = async (req, res) => {
    try {
        const notification = req.body;  
        console.log("Received notification:", notification);
        const statusResponse = await coreApi.transaction.notification(notification);
        console.log("Transaction status:", statusResponse.transaction_status);
        res.status(200).json({ message: "Notification received" });
    } catch (error) {
        console.error("Error handling notification:", error);
        res.status(500).json({ message: "Failed to handle notification" });
    }
};