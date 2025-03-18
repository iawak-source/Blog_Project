import { db } from "../db.js";
import bcrypt from "bcryptjs"; // lỗi vì quên import bcryptjs
import jwt from "jsonwebtoken";
export const register = (req, res) => {

    //Check email and username are already exist

    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(q, [req.body.email, req.body.name], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("User aldready exist");

        //Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hash,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User registered successfully");
        });
    });
};


export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi server" });
        if (!data.length) return res.status(404).json({ error: "User not found" });

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: data[0].id }, "jwtkey", { expiresIn: "1h" });

        const { password, ...other } = data[0];

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }).status(200).json(other);
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: false, // ❌ Nếu frontend chạy trên HTTP, không dùng `true`
        sameSite: "lax"
    }).status(200).json({ message: "Logout successfully" });
};