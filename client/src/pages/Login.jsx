// Import các hook và thư viện cần thiết
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { AuthContext } from "../context/authContext.jsx"; // ✅ Import context chứa thông tin xác thực

const Login = () => {
    // Khởi tạo state lưu input form (username + password)
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    // State để hiển thị lỗi khi đăng nhập sai
    const [error, setError] = useState(null);

    // Hook để điều hướng (redirect) sau khi đăng nhập thành công
    const navigate = useNavigate();

    // Lấy giá trị và hàm từ Context
    const { currentUser, login } = useContext(AuthContext);

    console.log("🔍 currentUser:", currentUser); // ✅ In ra thông tin user nếu đã đăng nhập

    // Khi người dùng nhập vào ô input
    const handleChange = (e) => {
        // Cập nhật lại state inputs theo từng field
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Khi người dùng nhấn nút "Login"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang

        try {
            // Gọi hàm login từ context, truyền inputs (username & password)
            await login(inputs);
            // Điều hướng về trang chủ nếu đăng nhập thành công
            navigate("/");
        } catch (err) {
            // Nếu lỗi từ backend
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Lỗi không xác định. Vui lòng thử lại!");
            } else {
                setError("Lỗi không xác định. Vui lòng thử lại!");
            }
            // In lỗi ra console
            console.error("❌ Lỗi đăng nhập:", err);
        }
    };

    return (
        <div className='auth'>
            <h1>Login</h1>
            <form>
                {/* Input username */}
                <input
                    required
                    type="text"
                    placeholder='username'
                    name='username'
                    onChange={handleChange}
                />
                {/* Input password */}
                <input
                    required
                    type="password"
                    placeholder='password'
                    name='password'
                    onChange={handleChange}
                />
                {/* Nút đăng nhập */}
                <button onClick={handleSubmit}>Login</button>

                {/* Hiển thị lỗi nếu có */}
                {error && <p>{error}</p>}

                {/* Đường dẫn đăng ký nếu chưa có tài khoản */}
                <span>
                    Bạn không có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
