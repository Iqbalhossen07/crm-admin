import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfileData({
          name: res.data.data.name,
          email: res.data.data.email,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setImagePreview(
          res.data.data.image ||
            "https://ui-avatars.com/api/?name=Admin&background=random&color=fff&rounded=true&bold=true",
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      profileData.newPassword &&
      profileData.newPassword !== profileData.confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Your new passwords do not match. Please check again.",
        borderRadius: "2rem",
        confirmButtonColor: "#000",
      });
      return;
    }

    if (profileData.newPassword && !profileData.oldPassword) {
      Swal.fire({
        icon: "warning",
        title: "Security Check",
        text: "Please enter your current password to authorize this change.",
        borderRadius: "2rem",
        confirmButtonColor: "#000",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);

      if (profileData.oldPassword)
        formData.append("oldPassword", profileData.oldPassword);
      if (profileData.newPassword)
        formData.append("newPassword", profileData.newPassword);
      if (selectedFile) formData.append("image", selectedFile);

      const res = await api.put("/auth/updateprofile", formData);

      if (res.data.success) {
        localStorage.setItem("adminUser", JSON.stringify(res.data.data));

        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your changes have been saved successfully.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });

        setProfileData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setSelectedFile(null);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || "Something went wrong!",
        confirmButtonColor: "#000",
        borderRadius: "2rem",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f9]">
        <Loader />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 lg:p-12 font-lora min-h-screen bg-[#f3f4f9] pb-24"
    >
      <Helmet>
        <title>Account Settings - SetsTech CRM</title>
      </Helmet>

      {/* 🌟 Header Section */}
      <div className="max-w-6xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 font-merriweather tracking-tight mb-3">
          Account <span className="text-gray-400">Settings</span>
        </h1>
        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-[0.3em]">
          Manage your administrative identity
        </p>
      </div>

      {/* 🌟 Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        {/* Top Accent Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-900 via-gray-700 to-black"></div>

        <form onSubmit={handleUpdate} className="p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* 📸 Left Column: Profile Picture */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group w-48 h-48 mb-6">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gray-200 rounded-[3rem] blur-xl group-hover:bg-gray-300 transition-all duration-500"></div>

                <img
                  src={imagePreview}
                  className="relative w-48 h-48 rounded-[3rem] object-cover border-[6px] border-white shadow-xl group-hover:scale-[1.02] group-hover:rotate-2 transition-all duration-500 z-10"
                  alt="Avatar"
                />

                <label
                  htmlFor="image-upload"
                  className="absolute -bottom-3 -right-3 z-20 bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-xl border-4 border-white"
                >
                  <i className="fa-solid fa-camera text-lg"></i>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <h3 className="text-xl font-black text-gray-900 font-merriweather tracking-tight">
                {profileData.name || "Admin User"}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 text-center leading-relaxed">
                Max file size: 2MB <br /> Square aspect ratio recommended
              </p>
            </div>

            {/* 📝 Right Column: Form Fields */}
            <div className="lg:col-span-8 space-y-10">
              {/* Personal Info Section */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
                  <i className="fa-regular fa-id-card text-gray-400"></i>{" "}
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                        <i className="fa-regular fa-user"></i>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent px-6 py-4 pl-12 rounded-2xl focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 font-bold text-gray-800 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent px-6 py-4 pl-12 rounded-2xl focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 font-bold text-gray-800 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6 pt-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-gray-400"></i>{" "}
                  Security Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Old Password */}
                  <div className="space-y-2 group md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 ml-2">
                      Current Password (Required for changes)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-400 transition-colors">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                      <input
                        type={showOldPass ? "text" : "password"}
                        name="oldPassword"
                        value={profileData.oldPassword}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent px-6 py-4 pl-12 rounded-2xl focus:outline-none focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 font-bold text-gray-800 pr-14 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <i
                          className={`fa-solid ${showOldPass ? "fa-eye-slash" : "fa-eye"}`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 ml-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
                        <i className="fa-solid fa-key"></i>
                      </div>
                      <input
                        type={showNewPass ? "text" : "password"}
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent px-6 py-4 pl-12 rounded-2xl focus:outline-none focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 font-bold text-gray-800 pr-14 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <i
                          className={`fa-solid ${showNewPass ? "fa-eye-slash" : "fa-eye"}`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 ml-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                        <i className="fa-solid fa-check-double"></i>
                      </div>
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent px-6 py-4 pl-12 rounded-2xl focus:outline-none focus:bg-white focus:border-green-200 focus:ring-4 focus:ring-green-50 font-bold text-gray-800 pr-14 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        <i
                          className={`fa-solid ${showConfirmPass ? "fa-eye-slash" : "fa-eye"}`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button Area */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium font-lora italic text-center sm:text-left">
                  Ensure your credentials are safe.{" "}
                  <br className="hidden sm:block" /> You will stay logged in
                  after updating.
                </p>
                <button
                  disabled={submitting}
                  className="w-full sm:w-auto px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-gray-800 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:bg-gray-300 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Processing
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up"></i> Save
                      Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Account;
