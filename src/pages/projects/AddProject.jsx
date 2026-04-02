import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios"; // আপনার কাস্টম এক্সিওস
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
// CKEditor Imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProject = () => {
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedClientId = searchParams.get("client_id");

  // স্টেট ম্যানেজমেন্ট
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    client_id: selectedClientId || "", // URL-এ থাকলে অটোমেটিক সেট হবে
  });

  // ১. হেডার সেটআপ এবং ক্লায়েন্ট ফেচিং
  useEffect(() => {
    setHeaderData({
      title: "Add New Project",
      subtitle: "Register a new client project",
      icon: "fa-solid fa-folder-plus",
    });

    const fetchClients = async () => {
      try {
        const res = await api.get("/admin/clients");
        setClients(res.data.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        Swal.fire("Error", "Could not load clients list", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [setHeaderData]);

  // ২. ইনপুট হ্যান্ডেলার
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ৩. ফর্ম সাবমিট
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client_id) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select a client to assign this project.",
        borderRadius: "2rem",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post("/admin/projects", formData);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Project Created!",
          text: "Project has been successfully added to the client.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });

        // সফল হলে প্রজেক্ট লিস্টে চলে যাবে (যেই ক্লায়েন্টের প্রজেক্ট, সেই লিস্টে)
        navigate(`/projects?client_id=${formData.client_id}`);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.error || "Could not create project",
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
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
      variants={containerVariants}
      className="w-full"
    >
      {/* হেডার সেকশন */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
            <i className="fa-solid fa-folder-plus text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Add New Project
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Register a new client project
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </motion.header>

      {/* ফর্ম কন্টেন্ট */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar">
        <form
          id="addProjectForm"
          className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2"
          onSubmit={handleSubmit}
        >
          {/* Section 1: Project Identification */}
          <motion.div
            variants={itemVariants}
            className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group"
          >
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
              <i className="fa-solid fa-folder-open text-indigo-600 mr-2"></i>{" "}
              1. Project Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="e.g. Website Redesign"
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                  Assign Client *
                </label>
                <div className="relative">
                  {selectedClientId ? (
                    // যদি URL থেকে Client ID আসে, তবে এটি Read Only দেখাবে
                    <input
                      type="text"
                      value={
                        clients.find((c) => c._id === selectedClientId)?.name ||
                        "Loading..."
                      }
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm"
                    />
                  ) : (
                    // নতুবা ড্রপডাউন থেকে সিলেক্ট করতে হবে
                    <div className="relative">
                      <select
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          -- Select a Client --
                        </option>
                        {clients.map((client) => (
                          <option key={client._id} value={client._id}>
                            {client.name}{" "}
                            {client.company_name
                              ? `(${client.company_name})`
                              : ""}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Project Details (CKEditor) */}
          <motion.div
            variants={itemVariants}
            className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm relative overflow-hidden group"
          >
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
              <i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 2.
              Project Details
            </h2>

            <div className="ck-editor-wrapper rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData({ ...formData, description: data });
                }}
              />
            </div>

            {/* ছোট একটি সিএসএস ট্রিক যাতে এডিটরের হাইট সুন্দর দেখায় */}
            <style>{`
              .ck-editor__editable_inline {
                min-height: 200px;
                font-family: inherit;
              }
            `}</style>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={itemVariants}
            className="pt-2 pb-8 flex justify-end"
          >
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#0F8FF0] active:scale-[0.98] sm:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 disabled:bg-gray-400"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-lg"></i>{" "}
                  Creating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rocket text-lg"></i> Create Project
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddProject;
