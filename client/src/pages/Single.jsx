// Import các hook và thư viện cần thiết
import React, { useContext, useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Menu from "../components/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";

const Single = () => {
  const [post, setPosts] = useState({}); // Lưu thông tin bài viết

  const location = useLocation(); // Lấy thông tin đường dẫn URL
  const navigate = useNavigate(); // Dùng để điều hướng

  const postId = location.pathname.split("/")[2]; // Lấy ID bài viết từ URL

  const { currentUser } = useContext(AuthContext); // Lấy thông tin user hiện tại từ context

  console.log(location); // Debug location

  // Gọi API lấy dữ liệu bài viết khi component mount hoặc postId thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/${postId}`);
        setPosts(res.data); // Gán dữ liệu bài viết vào state
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  // Xử lý xóa bài viết
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${postId}`, {
        withCredentials: true, // Gửi cookie token để xác thực người dùng
      });
      navigate("/"); // Chuyển về trang chủ sau khi xóa thành công
    } catch (err) {
      console.error("❌ Lỗi khi xóa bài viết:", err.response?.data || err);
    }
  };

  // Hàm tách phần text từ chuỗi HTML (loại bỏ tag)
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="single">
      <div className="content">
        {/* Hiển thị ảnh bài viết */}
        <img src={`../upload/${post?.img}`} alt="" />

        <div className="user">
          {/* Hiển thị ảnh đại diện người đăng nếu có */}
          {post.userImg && <img src={post.userImg} alt="" />}

          {/* Hiển thị tên người đăng và thời gian đăng */}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>

          {/* Nếu người đăng là current user thì hiển thị nút edit/delete */}
          {currentUser?.username === post?.username && (
            <div className="edit">
              {/* Nút sửa bài viết - gửi dữ liệu qua `state` */}
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="Edit icon" />
              </Link>

              {/* Nút xóa bài viết */}
              <img onClick={handleDelete} src={Delete} alt="Delete icon" />
            </div>
          )}
        </div>

        {/* Hiển thị tiêu đề và nội dung bài viết */}
        <h1>{post.title}</h1>
        <p>{getText(post.desc)}</p>
      </div>

      {/* Component hiển thị các bài viết cùng category */}
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
