import axios from "axios";

// URL ของ API ที่จะเชื่อมต่อ
const apiUrl = "http://localhost:8000";

// สร้าง axios instance ที่จะรวม Authorization header ทุกครั้ง
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`,
  },
});

// ฟังก์ชันเพื่ออัปเดต Authorization header หลังจากที่ผู้ใช้ล็อกอิน
export const updateAuthHeader = () => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  if (token && tokenType) {
    api.defaults.headers.Authorization = `${tokenType} ${token}`;
  } else {
    console.error("ไม่มี token หรือ token_type ใน localStorage");
  }
};

export default api;
