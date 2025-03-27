// Import React và hook useContext để sử dụng context
import React, { useContext } from 'react';

// Import logo hình ảnh
import Logo from "../img/logo.png";

// Import Link để điều hướng không reload trang
import { Link } from 'react-router-dom';

// Import AuthContext để lấy thông tin người dùng và logout
import { AuthContext } from '../context/authContext';

// Component Navbar
const Navbar = () => {

  // Lấy currentUser và hàm logout từ AuthContext
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className='navbar'>
      {/* Logo website, bấm vào sẽ quay về trang chủ */}
      <div className="logo">
        <Link to="/">
          <img src={Logo} alt='logo' />
        </Link>
      </div>

      {/* Danh sách các liên kết menu */}
      <div className='links'>
        {/* Các danh mục bài viết theo category */}
        <Link className="link" to="/?cat=art">ART</Link>
        <Link className="link" to="/?cat=technology">TECHNOLOGY</Link>
        <Link className="link" to="/?cat=science">SCIENCE</Link>
        <Link className="link" to="/?cat=cinema">CINEMA</Link>
        <Link className="link" to="/?cat=design">DESIGN</Link>
        <Link className="link" to="/?cat=food">FOOD</Link>

        {/* Hiển thị tên người dùng nếu đã đăng nhập */}
        <span>{currentUser?.username}</span>

        {/* Nếu đã login thì hiển thị nút Logout, ngược lại hiển thị Login */}
        {currentUser
          ? <span onClick={logout}>Logout</span>
          : <Link className="link" to="/login">Login</Link>
        }

        {/* Link để viết bài mới */}
        <span className="write">
          <Link className="link" to="/write">Write</Link>
        </span>
      </div>
    </div>  
  );
}

// Export component để dùng trong App
export default Navbar;
