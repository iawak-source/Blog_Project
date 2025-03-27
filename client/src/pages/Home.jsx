import React, { useState, useEffect } from "react"; // Import các hook React
import { Link, useLocation } from "react-router-dom"; // Link để điều hướng, useLocation để lấy query trên URL
import axios from "axios"; // Dùng để gọi API từ backend

// Component Home dùng để hiển thị danh sách bài viết theo thể loại (category)
const Home = () => {
  const [posts, setPosts] = useState([]); // State lưu danh sách bài viết từ API

  const cat = useLocation().search; // Lấy query string trên URL, ví dụ ?cat=art

  console.log(location); // In ra location để xem cấu trúc

  // Gọi API lấy danh sách bài viết khi category thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts${cat}`); // Gọi API với tham số ?cat
        setPosts(res.data); // Lưu dữ liệu vào state
      } catch (err) {
        console.log(err); // In lỗi nếu gọi API thất bại
      }
    };
    fetchData();
  }, [cat]); // useEffect sẽ chạy lại nếu cat (query URL) thay đổi

  // Hàm để loại bỏ thẻ HTML trong nội dung bài viết
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html"); // Parse HTML thành DOM
    return doc.body.textContent || ""; // Trả về nội dung văn bản (không có tag)
  };

  return (
    <div className='home'>
      <div className="posts">
        {/* Lặp qua mảng bài viết để hiển thị từng bài */}
        {posts.map(post => (
          <div className="post" key={post.id}>
            <div className="img">
              {/* Hiển thị ảnh bài viết (lưu ở thư mục upload phía server) */}
              <img src={`../upload/${post.img}`} alt=""></img>
            </div>
            <div className="content">
              {/* Link sang trang chi tiết bài viết */}
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              {/* Hiển thị phần mô tả rút gọn (loại bỏ tag HTML nếu có) */}
              <p>{getText(post.desc)}</p>
              {/* Nút điều hướng đến trang chi tiết bài viết */}
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
