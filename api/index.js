import express from "express";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(cors({ 
    origin: "http://localhost:5173", 
    credentials: true //  Cho phép gửi & nhận cookie giữa frontend & backend
}));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname) //Không bị đè lên khi đăng cùng tên file
    }
})
const upload = multer({ storage }); //  Lưu file vào thư mục "uploads/"

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json(file.filename); //  Trả về tên file
});



app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(8800, () => {
    console.log('✅ Server is running on port 8800');
});
