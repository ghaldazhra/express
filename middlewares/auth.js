import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }   

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user; // Simpan data user di request untuk digunakan di route selanjutnya
        next();
    } catch (err) {
        return res.status(401).json({ 
            message: "Unauthorized: Invalid token" 
        });
    }
};

export default auth;