import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

const EditClient = () => {
  const { id } = useParams(); // URL থেকে আইডি নেওয়া
  const { setHeaderData } = useHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // ১. বর্তমান ডাটাবেস থেকে ডাটা ফেচ করা
  useEffect(() => {
    setHeaderData({
      title: "Edit Client",
      subtitle: "Update client information",
      icon: "fa-solid fa-user-pen",
    });

    const fetchClient = async () => {
      try {
        const res = await api.get(`/admin/clients/${id}`);
        const client = res.data.data;
        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone,
          company_name: client.company_name,
          notes: client.notes,
        });
        setPreview(
          client.image ||
            `https://ui-avatars.com/api/?name=${client.name}&background=random`,
        );
        setLoading(false);
      } catch (err) {
        Swal.fire("Error", "Could not load client data", "error");
        navigate("/clients");
      }
    };
    fetchClient();
  }, [id, setHeaderData, navigate]);

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

      const res = await api.put(`/admin/clients/${id}`, data);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Client profile updated successfully.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });
        setTimeout(() => navigate("/clients"), 2000);
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Update Failed!",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* ১. হেডার */}
      <motion.header className="bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-4 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center mb-8 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100 shrink-0">
            <i className="fa-solid fa-user-pen text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Edit Client
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Updating: {formData.name}
            </p>
          </div>
        </div>
        <Link
          to="/clients"
          className="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Cancel
        </Link>
      </motion.header>

      {/* ২. ফর্ম */}
      <div className="max-w-4xl mx-auto pb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Details Section */}
          <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
            <h2 className="text-xl font-bold font-merriweather text-gray-900 mb-6 border-b border-gray-100 pb-4">
              <i className="fa-solid fa-id-card text-blue-500 mr-2"></i> Client
              Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl focus:bg-white focus:border-blue-200 outline-none font-bold text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl focus:bg-white focus:border-blue-200 outline-none font-bold text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl focus:bg-white focus:border-blue-200 outline-none font-bold text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl focus:bg-white focus:border-blue-200 outline-none font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
            <h2 className="text-xl font-bold font-merriweather text-gray-900 mb-6 border-b border-gray-100 pb-4">
              <i className="fa-solid fa-note-sticky text-green-500 mr-2"></i>{" "}
              Additional Notes
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl focus:bg-white focus:border-green-200 outline-none font-bold text-gray-900 resize-none"
            ></textarea>
          </div>

          {/* Image Section */}
          <div className="bg-white border border-gray-100 rounded-[30px] p-8 shadow-sm">
            <h2 className="text-xl font-bold font-merriweather text-gray-900 mb-6 border-b border-gray-100 pb-4">
              <i className="fa-solid fa-camera text-purple-500 mr-2"></i> Client
              Avatar
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-md"
                />
                <label
                  htmlFor="edit_image"
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-purple-600 transition-colors border-4 border-white"
                >
                  <i className="fa-solid fa-camera text-xs"></i>
                </label>
                <input
                  type="file"
                  id="edit_image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">
                  Change Profile Photo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Leave as it is to keep the current photo.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 pb-10">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-max px-12 py-4 bg-[#0F8FF0] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-circle"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditClient;
