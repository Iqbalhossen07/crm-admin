import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditProject = () => {
  const { id } = useParams();
  const { setHeaderData } = useHeader();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientName, setClientName] = useState(""); // ক্লায়েন্টের নাম দেখানোর জন্য

  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
  });

  useEffect(() => {
    setHeaderData({
      title: "Edit Project",
      subtitle: "Update project requirements",
      icon: "fa-solid fa-pen-to-square",
    });

    const fetchProjectData = async () => {
      try {
        const res = await api.get(`/admin/projects/${id}`);
        const { project_name, description, client_id } = res.data.data;

        setFormData({ project_name, description });
        setClientName(client_id?.name || "Unknown Client");
        setLoading(false);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load project details", "error");
        navigate(-1);
      }
    };

    fetchProjectData();
  }, [id, setHeaderData, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.put(`/admin/projects/${id}`, formData);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Successfully Updated!",
          text: "Project changes have been saved.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.error || "Could not save changes",
        borderRadius: "2rem",
      });
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
      {/* Header */}
      <motion.header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100">
            <i className="fa-solid fa-pen-to-square text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Edit Project
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Project ID: #{id.slice(-6)}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </motion.header>

      <div className="max-w-4xl mx-auto pb-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Section 1: Name & Client (Client is Read-Only) */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-6 border-b border-gray-100 pb-4">
              <i className="fa-solid fa-folder-open text-indigo-600 mr-2"></i>{" "}
              1. Basic Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-200 px-5 py-4 rounded-2xl focus:border-indigo-300 outline-none font-bold text-gray-800 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Assigned Client (Fixed)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={clientName}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 px-5 py-4 rounded-2xl font-bold text-gray-500 cursor-not-allowed shadow-inner"
                  />
                  <div className="absolute inset-y-0 right-5 flex items-center text-gray-300">
                    <i className="fa-solid fa-lock text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: CKEditor Description */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[30px] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-6 border-b border-gray-100 pb-4">
              <i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 2.
              Project Scope
            </h2>
            <div className="ck-editor-wrapper rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData({ ...formData, description: data });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pb-10">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-max px-12 py-4 bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-[#0F8FF0] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-gray-400"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check-circle"></i> Update Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .ck-editor__editable_inline {
          min-height: 250px;
          font-family: inherit;
        }
      `}</style>
    </motion.div>
  );
};

export default EditProject;
