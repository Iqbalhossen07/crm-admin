import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🎯 এখানে লজিকটা চেঞ্জ করতে হবে
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // 🔥 ট্রিক: যদি ইউজার অলরেডি লগইন পেজে থাকে, তবে রিডাইরেক্ট করার দরকার নাই
      // কারণ লগইন করার সময় ভুল পাসওয়ার্ড দিলে ৪০১ আসবেই, ওটা ইন্টারসেপ্টরে ধরা যাবে না
      const isLoginPage = window.location.pathname === "/login";

      if (!isLoginPage) {
        console.error("🔒 Session Expired! Redirecting...");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
