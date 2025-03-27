// Import axios để gọi API
import axios from "axios";

// Import React hook để quản lý state và side effects
import { createContext, useState, useEffect } from "react";

// Tạo context để chia sẻ dữ liệu người dùng giữa các component
export const AuthContext = createContext();

// Tạo component Provider bọc toàn bộ ứng dụng
const AuthContextProvider = ({ children }) => {
    // Lấy thông tin người dùng từ localStorage nếu có, nếu không thì null
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    // Hàm login gọi API backend để xác thực và lưu user
    const login = async (inputs) => {
        const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
            withCredentials: true // Gửi cookie kèm theo
        });
        setCurrentUser(res.data); // Cập nhật user vào state
    };

    // Hàm logout: gọi API để xóa token cookie và reset trạng thái
    const logout = async () => {
        try {
            const res = await axios.get("http://localhost:8800/api/auth/logout", {
                withCredentials: true // Gửi cookie để server biết user nào đang đăng xuất
            });
            setCurrentUser(null); // Xoá state người dùng
            localStorage.removeItem("user"); // Xoá người dùng khỏi localStorage
            console.log("✅ Logout thành công:", res.data); // In ra thành công
        } catch (error) {
            console.error("❌ Lỗi logout:", error); // Báo lỗi nếu có
        }
    };

    // Khi `currentUser` thay đổi thì cập nhật lại vào localStorage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    // Trả về Provider chứa thông tin và chức năng đăng nhập/đăng xuất
    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export component để bọc vào App trong `main.jsx`
export default AuthContextProvider;
