import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios"; // আপনার কাস্টম এক্সিওস
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const AddDeveloper = () => {
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();

  // স্টেটস
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "https://ui-avatars.com/api/?name=New+Dev&background=e2e8f0&color=94a3b8&size=128",
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
  });

  useEffect(() => {
    setHeaderData({
      title: "Add Developer",
      subtitle: "Onboard a new team member",
      icon: "fa-solid fa-user-plus",
    });
  }, [setHeaderData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ইমেজ প্রিভিউ এবং ফাইল সিলেক্ট লজিক
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

  // 🎯 ফর্ম সাবমিট লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone); // এটাই ব্যাকএন্ডে পাসওয়ার্ড হিসেবে সেট হবে
      data.append("skills", formData.skills);
      if (selectedFile) data.append("image", selectedFile);

      const res = await api.post("/admin/developers", data);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Developer Created!",
          text: "Login account and profile ready.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });

        setTimeout(() => navigate("/developers"), 2000); // ডেভেলপার লিস্টে চলে যাবে
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Something went wrong!",
        borderRadius: "2rem",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
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
      <motion.header
        variants={cardVariants}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-blue-200 shrink-0">
            <i className="fa-solid fa-user-plus text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Add Developer
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              MERN System Integration
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
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
                required
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Phone (Will be Password) *
              </label>
              <input
                type="text"
                name="phone"
                required
                placeholder="+8801700..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-blue-200 transition-all font-bold text-gray-800 shadow-sm"
                onChange={handleChange}
              />
            </div>
            <div className="opacity-50">
              <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                Default Role
              </label>
              <input
                type="text"
                value="Developer"
                readOnly
                className="w-full px-4 py-3.5 bg-gray-100 border border-transparent rounded-xl font-bold text-gray-500 cursor-not-allowed"
              />
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
              Core Skills (Comma Separated)
            </label>
            <input
              type="text"
              name="skills"
              placeholder="React, Node, MongoDB, Laravel..."
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
                name="image"
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
                <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Choose Photo
              </button>
              <p className="text-[10px] text-gray-400 font-bold mt-2 italic">
                Standard square images work best.
              </p>
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
            disabled={loading}
            className="w-full sm:w-auto px-12 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-3 disabled:bg-gray-300"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-lg"></i>{" "}
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-check text-lg"></i> Create
                Developer
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddDeveloper;
