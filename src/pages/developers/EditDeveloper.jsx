import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const EditDeveloper = () => {
  const { id } = useParams(); // URL থেকে আইডি নেওয়া
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // স্টেটস
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    status: "active", // এডিট এর জন্য নতুন ফিল্ড
  });

  useEffect(() => {
    setHeaderData({
      title: "Edit Developer",
      subtitle: "Update team member details",
      icon: "fa-solid fa-user-pen",
    });
    fetchDeveloper();
  }, [id, setHeaderData]);

  // ১. বর্তমান ডাটা ফেচ করা
  const fetchDeveloper = async () => {
    try {
      const res = await api.get(`/admin/developers/${id}`);
      const dev = res.data.data;
      setFormData({
        name: dev.name,
        email: dev.email,
        phone: dev.phone,
        skills: dev.skills,
        status: dev.status,
      });
      setImagePreview(
        dev.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=random`,
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not load developer data", "error");
      navigate(-1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🎯 আপডেট সাবমিট লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("skills", formData.skills);
      data.append("status", formData.status); // স্ট্যাটাস অ্যাপেন্ড
      if (selectedFile) data.append("image", selectedFile);

      const res = await api.put(`/admin/developers/${id}`, data);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Successfully Updated!",
          text: "Developer profile has been updated.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });

        setTimeout(() => navigate("/developers"), 2000);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Update failed!",
        borderRadius: "2rem",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
    >
      {/* হেডার সেকশন - আপনার অরিজিনাল ডিজাইন */}
      <motion.header
        variants={cardVariants}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 text-orange-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-orange-100 shrink-0">
            <i className="fa-solid fa-user-pen text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Edit Developer
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Update team member profile
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </motion.header>

      <form
        className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2"
        onSubmit={handleSubmit}
      >
        {/* Section 1: Account Details */}
        <motion.div
          variants={cardVariants}
          className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group"
        >
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-id-card text-blue-600 mr-2"></i> 1.
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                required
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
              />
            </div>
            {/* 🎯 স্ট্যাটাস ড্রপডাউন - আপনার স্টাইলেই */}
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Developer Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-emerald-200 transition-all font-bold text-gray-800 shadow-sm cursor-pointer appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Professional Details */}
        <motion.div
          variants={cardVariants}
          className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group"
        >
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-code text-purple-600 mr-2"></i> 2.
            Professional Details
          </h2>
          <div className="relative z-10">
            <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
              Core Skills (String)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              placeholder="React, Node, MongoDB..."
              className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-purple-200 transition-all font-bold text-gray-800 shadow-sm"
              onChange={handleChange}
            />
          </div>
        </motion.div>

        {/* Section 3: Profile Image */}
        <motion.div
          variants={cardVariants}
          className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group"
        >
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-image text-orange-600 mr-2"></i> 3.
            Profile Image
          </h2>
          <div className="relative z-10 flex items-center gap-6">
            <img
              src={imagePreview}
              className="w-24 h-24 rounded-2xl shadow-md object-cover border-4 border-white bg-gray-100"
              alt="Preview"
            />
            <div>
              <input
                type="file"
                id="dev_image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => document.getElementById("dev_image").click()}
                className="px-5 py-3 bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-gray-100 transition-all active:scale-95"
              >
                <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Change Photo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={cardVariants}
          className="pt-2 pb-10 flex justify-end"
        >
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-12 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-3"
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Updating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-check"></i> Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EditDeveloper;
