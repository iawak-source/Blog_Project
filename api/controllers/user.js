import { db } from "../db.js";

export const getAllUsers = (req, res) => {
    const q = "SELECT id, username, email FROM users";  // Không trả về password
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi server" });
        return res.status(200).json(data);
    });
};