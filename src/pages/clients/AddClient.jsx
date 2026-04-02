import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios"; // আপনার কাস্টম এক্সিওস
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const AddClient = () => {
  const { setHeaderData } = useHeader();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(
    "https://ui-avatars.com/api/?name=New+Client&background=random&size=256",
  );

  // ১. ফর্ম স্টেট
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setHeaderData({
      title: "Add New Client",
      subtitle: "Register a new client profile",
      icon: "fa-solid fa-user-plus",
    });
  }, [setHeaderData]);

  // ২. ইনপুট হ্যান্ডেলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ৩. ফর্ম সাবমিট লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("company_name", formData.company_name);
      data.append("notes", formData.notes);
      if (selectedFile) data.append("image", selectedFile);

      // ব্যাকএন্ড এপিআই কল
      const res = await api.post("/admin/clients", data);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Client Added!",
          text: "Client profile and User account created successfully.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });

        // সফল হলে ২ সেকেন্ড পর ক্লায়েন্ট লিস্টে চলে যাবে
        setTimeout(() => {
          navigate("/clients");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.error || "Something went wrong!",
        confirmButtonColor: "#000",
        borderRadius: "2rem",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // এনিমেশন ভেরিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* ১. কাস্টম হেডার সেকশন (আপনার ডিজাইন অনুযায়ী) */}
      <motion.header className="bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
            <i className="fa-solid fa-user-plus text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Add Client
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              MERN System Sync
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
          <Link
            to="/clients"
            className="w-full sm:w-auto flex justify-center px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-xl shadow-md transition-all items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </Link>
        </div>
      </motion.header>

      {/* ২. ফর্ম কন্টেন্ট */}
      <div className="flex-1 overflow-y-auto pb-10 w-full">
        {submitting ? (
          <div className="h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <form
            className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2"
            onSubmit={handleSubmit}
          >
            {/* Section 1: Client Details */}
            <motion.div
              variants={cardVariants}
              className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-100 pb-4">
                <i className="fa-solid fa-address-card text-[#0F8FF0] mr-2"></i>{" "}
                1. Client Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Arif Hasan"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0F8FF0]/50 transition-all font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="e.g. Tech BD Ltd."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0F8FF0]/50 transition-all font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. client@example.com"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0F8FF0]/50 transition-all font-bold text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-widest pl-1">
                    Phone (Will be password) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-[#0F8FF0]/50 transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 2: Notes */}
            <motion.div
              variants={cardVariants}
              className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-100 pb-4">
                <i className="fa-solid fa-notes-medical text-green-600 mr-2"></i>{" "}
                2. Additional Notes
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Enter client address or specific requirements..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-green-500/50 transition-all font-bold text-gray-900 resize-none"
              ></textarea>
            </motion.div>

            {/* Section 3: Photo Upload */}
            <motion.div
              variants={cardVariants}
              className="bg-white border border-gray-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-100 pb-4">
                <i className="fa-solid fa-image text-purple-600 mr-2"></i> 3.
                Client Avatar
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] object-cover border-4 border-gray-50 shadow-md"
                  />
                  <label
                    htmlFor="client_image"
                    className="absolute -bottom-1 -right-1 w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors shadow-lg border-2 border-white"
                  >
                    <i className="fa-solid fa-camera text-xs"></i>
                  </label>
                  <input
                    type="file"
                    id="client_image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-700">
                    Set Profile Picture
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-bold">
                    Initial login password will be the Phone Number.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={cardVariants} className="pt-2 pb-10">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-max px-12 py-4 bg-black text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#0F8FF0] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-gray-300"
              >
                <i className="fa-solid fa-user-check"></i> Register Client Now
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default AddClient;
