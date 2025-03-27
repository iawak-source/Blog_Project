// Import các hook và thư viện cần thiết
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = () => {
    // Khởi tạo state lưu input form (username, email, password)
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });

    // State để hiển thị lỗi nếu có trong quá trình đăng ký
    const [error, setError] = useState(null);

    // Dùng để điều hướng đến trang khác (VD: sau khi đăng ký thì chuyển sang login)
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng thay đổi giá trị trong input
    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Hàm xử lý khi người dùng submit form đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn không cho reload lại trang

        try {
            // Gửi dữ liệu đăng ký đến backend
            const res = await axios.post("http://localhost:8800/api/auth/register", inputs);
            console.log(res.data); // In ra kết quả phản hồi nếu thành công

            // Điều hướng sang trang login nếu đăng ký thành công
            navigate("/login");
        } catch (err) {
            // Nếu có lỗi từ backend (VD: tài khoản đã tồn tại)
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Lỗi không xác định. Vui lòng thử lại!");
            }
            console.error("❌ Lỗi đăng ký:", err);
        }
    };

    return (
        <div className='auth'>
            <h1>Register</h1>
            <form>
                {/* Ô nhập username */}
                <input
                    required
                    type="text"
                    placeholder='username'
                    name='username'
                    onChange={handleChange}
                />

                {/* Ô nhập email */}
                <input
                    required
                    type="email"
                    placeholder='email'
                    name='email'
                    onChange={handleChange}
                />

                {/* Ô nhập password */}
                <input
                    required
                    type="password"
                    placeholder='password'
                    name='password'
                    onChange={handleChange}
                />

                {/* Nút đăng ký */}
                <button onClick={handleSubmit}>Register</button>

                {/* Hiển thị lỗi nếu có */}
                {error && <p>{error}</p>}

                {/* Đường dẫn sang trang đăng nhập */}
                <span>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay!</Link>
                </span>
            </form>
        </div>
    );
};

export default Register;
