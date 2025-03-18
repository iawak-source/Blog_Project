import express from "express";
import { getAllUsers } from "../controllers/user.js";  // Kiểm tra tên thư mục

const router = express.Router();

router.get("/", getAllUsers);  // Endpoint lấy tất cả user

export default router;