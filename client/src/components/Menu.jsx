// Import axios để gọi API
import axios from 'axios';

// Import React và các hook cần thiết
import React, { useEffect, useState } from 'react';

// Import Link từ react-router-dom để điều hướng
import { Link } from "react-router-dom";

const Menu = ({ cat }) => {
  // Khởi tạo state lưu danh sách bài viết liên quan
  const [posts, setPosts] = useState([]);

  // Gọi API mỗi khi `cat` (category) thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gửi request GET đến backend kèm category
        const res = await axios.get(`http://localhost:8800/api/posts?cat=${cat}`);
        // Lưu kết quả vào state `posts`
        setPosts(res.data);
      } catch (err) {
        // Nếu lỗi thì log ra console
        console.log(err);
      }
    };
    fetchData(); // Gọi hàm fetchData ngay khi useEffect chạy
  }, [cat]); // Chạy lại khi `cat` thay đổi

  return (
    <div className="menu">
      {/* Tiêu đề section gợi ý */}
      <h1>Other post you may like</h1>

      {/* Lặp qua danh sách bài viết và render từng bài */}
      {posts.map((post) => (
        <div className="post" key={post.id}>
          {/* Hiển thị ảnh đại diện bài viết */}
          <img src={`../upload/${post?.img}`} alt="" />

          {/* Hiển thị tiêu đề bài viết */}
          <h2>{post.title}</h2>

          {/* Nút "Read More" dẫn đến trang chi tiết bài viết */}
          <Link to={`/post/${post.id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

// Export component để dùng nơi khác
export default Menu;
