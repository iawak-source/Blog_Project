// Import kết nối đến cơ sở dữ liệu
import { db } from "../db.js";

// Import thư viện JWT để xác thực token
import jwt from "jsonwebtoken";

// -----------------------------
//  GET ALL POSTS (LẤY DANH SÁCH BÀI VIẾT)
// -----------------------------
export const getPosts = (req, res) => {
    // Nếu có truy vấn theo category, lọc theo `cat`, ngược lại lấy tất cả
    const q = req.query.cat
        ? "SELECT * FROM posts WHERE cat=?"
        : "SELECT * FROM posts";

    // Gửi truy vấn tới DB, truyền cat nếu có
    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.status(500).send(err); // Báo lỗi nếu có
        return res.status(200).json(data); // Trả dữ liệu bài viết
    });
};

// -----------------------------
//  GET ONE POST (LẤY CHI TIẾT MỘT BÀI VIẾT)
// -----------------------------
export const getPost = (req, res) => {
    // Lấy thông tin bài viết cùng thông tin người đăng
    const q = `
        SELECT p.id, username, title, \`desc\`, p.img, u.img AS userImg, cat, date 
        FROM users u 
        JOIN posts p ON u.id = p.uid 
        WHERE p.id = ?
    `;

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err); // Trả lỗi nếu có
        return res.status(200).json(data[0]); // Trả về bài viết đầu tiên (vì id là duy nhất)
    });
};

// -----------------------------
//  DELETE POST (XÓA BÀI VIẾT)
// -----------------------------
export const deletePost = (req, res) => {
    // Lấy token từ cookie
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    // Xác minh token
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const postId = req.params.id;

        // Chỉ cho xóa nếu post thuộc về user đang đăng nhập
        const q = "DELETE FROM posts WHERE id = ? AND uid = ?";

        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err) return res.status(403).json("You can delete only your post!");
            return res.json("Post has been deleted!");
        });
    });
};

// -----------------------------
//  UPDATE POST (CẬP NHẬT BÀI VIẾT)
// -----------------------------
export const updatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        console.log("🔍 ID nhận được:", req.params.id); // Kiểm tra ID

        if (!req.params.id || req.params.id === "undefined") {
            return res.status(400).json("Invalid post ID");
        }

        const postId = parseInt(req.params.id); // Đảm bảo là số nguyên

        // Query để update post
        const q = `
            UPDATE posts 
            SET title = ?, \`desc\` = ?, img = ?, cat = ?
            WHERE id = ? AND uid = ?
        `;

        // Lấy dữ liệu mới từ request body
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ];

        // Thực thi query
        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json("Post has been updated!");
        });
    });
};

// -----------------------------
//  ADD POST (THÊM MỚI BÀI VIẾT)
// -----------------------------
export const addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        // Kiểm tra độ dài mô tả bài viết
        if (req.body.desc.length > 1000) {
            return res.status(400).json({ error: "Mô tả quá dài, tối đa 1000 ký tự" });
        }

        // Câu SQL để thêm bài viết
        const q = `
            INSERT INTO posts (title, \`desc\`, img, cat, date, uid) 
            VALUES (?)
        `;

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id, // Lấy từ token
        ];

        // Gửi dữ liệu vào database
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json("Bài viết đã được đăng thành công");
        });
    });
};
