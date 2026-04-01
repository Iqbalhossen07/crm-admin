import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2"; // 🔥 SweetAlert2 ইমপোর্ট

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); // ফর্ম রিলোড আটকানো
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));

        // সাকসেস মেসেজ আসা পর্যন্ত অপেক্ষা করা
        await Swal.fire({
          icon: "success",
          title: `<span style="font-family: Merriweather, serif; font-weight: 900;">Welcome Back, ${res.data.user.name}!</span>`,
          text: "Login Successful. Redirecting to Dashboard...",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
          background: "#ffffff",
        });

        navigate("/");
      }
    } catch (err) {
      console.error("Full Error Response:", err.response?.data);

      // ১. এরর মেসেজ নিখুঁতভাবে বের করা
      const errorMessage =
        err.response?.data?.error || "Invalid email or password";
      const statusCode = err.response?.status;

      let swalTitle = "Login Failed";
      let swalText = errorMessage;

      // ২. কন্ডিশনাল মেসেজ
      if (statusCode === 403) {
        swalTitle = "Access Denied!";
        swalText = "This panel is only for Admins.";
      } else if (statusCode === 401) {
        swalTitle = "Invalid Credentials";
        swalText = "Oops! Your email or password does not match.";
      } else if (!err.response) {
        swalTitle = "Network Error";
        swalText = "Server is not responding. Is your backend running?";
      }

      // ৩. পপ-আপ আসা পর্যন্ত ওয়েট করা
      await Swal.fire({
        icon: "error",
        title: `<span style="font-family: Merriweather, serif; font-weight: 900; color: #ef4444;">${swalTitle}</span>`,
        text: swalText,
        confirmButtonColor: "#000000",
        borderRadius: "2rem",
        confirmButtonText: "TRY AGAIN",
      });
    } finally {
      // 🎯 এই লাইনটিই আসল! সাকসেস হোক বা এরর, লোডিং বন্ধ হবে।
      setLoading(false);
    }
  };

  const icons = [
    { icon: "fa-rocket", top: "10%", left: "20%", color: "text-blue-400" },
    {
      icon: "fa-shield-halved",
      top: "40%",
      left: "10%",
      color: "text-purple-400",
    },
    { icon: "fa-chart-pie", top: "70%", left: "25%", color: "text-pink-400" },
    {
      icon: "fa-laptop-code",
      top: "20%",
      left: "70%",
      color: "text-green-400",
    },
    { icon: "fa-users", top: "50%", left: "80%", color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f3f4f9]">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-4xl font-black font-merriweather text-gray-900 mb-2 tracking-tight">
              Admin Login
            </h2>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
              Sets Tech CRM v2.0
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="admin@setstech.com"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <i
                    className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}
                  ></i>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:bg-gray-300"
            >
              {loading ? "Verifying..." : "Secure Access"}
            </button>
          </form>
        </motion.div>
      </div>

      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden items-center justify-center">
        {icons.map((item, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + index, repeat: Infinity }}
            className={`absolute text-5xl ${item.color}`}
            style={{ top: item.top, left: item.left }}
          >
            <i className={`fa-solid ${item.icon}`}></i>
          </motion.div>
        ))}
        <div className="text-center relative z-10 px-10">
          <h1 className="text-5xl font-black text-white font-merriweather mb-4 leading-tight">
            Focus on <br /> Execution.
          </h1>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">
            Admin Management Suite
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
