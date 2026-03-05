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

        console.log("Request body:", req.body);

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
            redirect_url: transaction.redirect_url,
            order_id: parameter.transaction_details.order_id
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

const statusResponse = await coreApi.transaction.notification(notification);

const orderId = statusResponse.order_id;
const transactionStatus = statusResponse.transaction_status;
const fraudStatus = statusResponse.fraud_status;
const paymentType = statusResponse.payment_type;

console.log("Order ID:", orderId);
console.log("Transaction Status:", transactionStatus);

if (transactionStatus === "capture") {
    if (fraudStatus === "accept") { 
        console.log("Payment successful for (capture)");
    }
} else if (transactionStatus === "settlement") {
    console.log("Payment successful for (settlement)");
} else if (transactionStatus === "pending") {
    console.log("Payment pending");
} else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
) {
    console.log("Payment failed");
}
        res.status(200).json({ message: "Notification received" });
    }
    catch (error) {
        console.error("Error handling notification:", error);
        res.status(500).json({ message: "Failed to handle notification" });
    }  
};

export const checkStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const statusResponse = await coreApi.transaction.status(orderId);

        res.status(200).json({
            orderId: statusResponse.order_id,
            transactionStatus: statusResponse.transaction_status,
            paymentType: statusResponse.payment_type,
            fraudStatus: statusResponse.fraud_status
        });
    } catch (error) {
        console.error("Error checking transaction status:", error);
        res.status(500).json({ message: "Failed to check transaction status" });
    }   
};