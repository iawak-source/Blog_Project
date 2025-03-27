// Import kết nối cơ sở dữ liệu từ file db.js
import { db } from "../db.js";

// Import thư viện để mã hóa mật khẩu
import bcrypt from "bcryptjs";

// Import thư viện để tạo JWT (JSON Web Token)
import jwt from "jsonwebtoken";

// -----------------------------
// ✅ HÀM ĐĂNG KÝ NGƯỜI DÙNG MỚI
// -----------------------------
export const register = (req, res) => {
    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    db.query(q, [req.body.email, req.body.name], (err, data) => {
        if (err) return res.json(err); // Trả lỗi nếu query thất bại

        if (data.length) 
            return res.status(409).json("User already exists"); // Nếu đã có user thì trả về lỗi 409

        // Mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10); // Tạo salt với độ mạnh là 10
        const hash = bcrypt.hashSync(req.body.password, salt); // Mã hóa password

        // Tạo câu lệnh INSERT để thêm user mới
        const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";

        // Truyền giá trị vào câu query
        const values = [
            req.body.username,
            req.body.email,
            hash, // Dùng mật khẩu đã mã hóa
        ];

        // Thực thi câu truy vấn để lưu user
        db.query(q, [values], (err, data) => {
            if (err) return res.json(err); // Trả lỗi nếu lưu thất bại
            return res.status(200).json("User registered successfully"); // Thành công
        });
    });
};

// -----------------------------
//  HÀM ĐĂNG NHẬP NGƯỜI DÙNG
// -----------------------------
export const login = (req, res) => {
    // Tìm user theo username
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json({ error: "Lỗi server" }); // Lỗi hệ thống
        if (!data.length) return res.status(404).json({ error: "User not found" }); // Không tìm thấy user

        // So sánh password người dùng nhập vào với password đã hash
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if (!isPasswordCorrect) 
            return res.status(400).json({ error: "Invalid password" }); // Sai mật khẩu

        // Tạo JWT token với id user làm payload
        const token = jwt.sign({ id: data[0].id }, "jwtkey", { expiresIn: "1h" });

        // Tách thông tin user, bỏ mật khẩu ra
        const { password, ...other } = data[0];

        // Trả cookie về client chứa access_token
        res.cookie("access_token", token, {
            httpOnly: true,       // Không cho truy cập từ JS client (tăng bảo mật)
            secure: false,        // false nếu chưa dùng HTTPS
            sameSite: "lax",      // Bảo vệ khỏi CSRF (tương đối)
        }).status(200).json(other); // Trả dữ liệu user (trừ mật khẩu)
    });
};

// -----------------------------
//  HÀM ĐĂNG XUẤT
// -----------------------------
export const logout = (req, res) => {
    // Xóa cookie chứa token
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: false, // false vì chưa chạy HTTPS
        sameSite: "lax",
    }).status(200).json({ message: "Logout successfully" }); // Trả kết quả
};
