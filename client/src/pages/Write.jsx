// Import các thư viện và hook cần thiết
import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Trình soạn thảo rich-text
import 'react-quill/dist/quill.snow.css'; // Giao diện cho ReactQuill
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment"; // Thư viện xử lý ngày giờ

const Write = () => {
  const state = useLocation().state; // Lấy dữ liệu truyền qua `Link` nếu đang edit bài viết

  // State cho các trường nhập liệu
  const [title, setTitle] = useState(state ? state.title : ""); // Tiêu đề bài viết
  const [desc, setDesc] = useState(state ? state.desc : ""); // Nội dung bài viết (rich text)
  const [file, setFile] = useState(null); // File ảnh đính kèm
  const [cat, setCat] = useState(state ? state.cat : ""); // Danh mục bài viết

  const navigate = useNavigate(); // Dùng để chuyển trang sau khi đăng bài

  // Hàm xử lý upload ảnh
  const upload = async () => {
    if (!file) return null; // Nếu không có file thì không upload

    try {
        const formData = new FormData(); // Tạo form dữ liệu
        formData.append("file", file); // Gắn file ảnh

        // Gửi request đến backend để upload ảnh
        const res = await axios.post("http://localhost:8800/api/upload", formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data; // Trả về tên file từ server
    } catch (err) {
        console.error("❌ Lỗi upload ảnh:", err);
    }
    return null;
  };

  // Hàm xử lý khi bấm nút Publish
  const handleClick = async (e) => {
    e.preventDefault();

    const imgUrl = await upload(); // Nếu có file thì upload lên server

    try {
      if (state) {
        // Nếu có state tức là đang ở chế độ "edit"
        await axios.put(`http://localhost:8800/api/posts/${state.id}`, {
          title,
          desc, // Nội dung bài viết
          cat,
          img: file ? imgUrl : state.img, // Nếu có ảnh mới thì dùng ảnh mới, không thì giữ nguyên
        }, { withCredentials: true });
      } else {
        // Nếu không có state thì đang ở chế độ "tạo mới"
        await axios.post(`http://localhost:8800/api/posts/`, {
          title,
          desc,
          cat,
          img: imgUrl,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Thêm thời gian tạo
        }, { withCredentials: true });
      }

      navigate("/"); // Quay lại trang chủ sau khi đăng
    } catch (err) {
      console.log("❌ Lỗi khi đăng bài:", err.response?.data || err);
    }
  };

  return (
    <div className='add'>
      {/* Phần nhập tiêu đề và nội dung */}
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={e => setTitle(e.target.value)} // Cập nhật tiêu đề
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={desc}
            onChange={setDesc} // Cập nhật nội dung bài viết
          />
        </div>
      </div>

      {/* Phần menu bên phải */}
      <div className="menu">
        {/* Khu vực Publish */}
        <div className="item">
          <h1>Publish</h1>
          <span><b>Status: </b> Draft</span>
          <span><b>Visibility: </b> Public</span>

          {/* Input chọn ảnh (ẩn đi) */}
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={e => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">Upload Image</label>

          {/* Nút thao tác */}
          <div className="buttons">
            <button>Save as Draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>

        {/* Khu vực chọn danh mục */}
        <div className="item">
          <h1>Categories</h1>
          {/* Tạo radio button cho mỗi danh mục */}
          {["art", "science", "technology", "cinema", "design", "food"].map((category) => (
            <div className="cat" key={category}>
              <input
                type="radio"
                checked={cat === category}
                name="cat"
                value={category}
                id={category}
                onChange={e => setCat(e.target.value)} // Cập nhật danh mục
              />
              <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Write;
