import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHeader } from "../../components/layout/HeaderContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

// 🎯 CKEditor Imports
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddJob = () => {
  const navigate = useNavigate();
  const { setHeaderData } = useHeader();
  const [searchParams] = useSearchParams();

  // URL থেকে প্রজেক্ট আইডি ধরা
  const getProjectId = searchParams.get("project_id") || "";

  // স্টেটস
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [projectName, setProjectName] = useState("Loading...");
  const [developers, setDevelopers] = useState([]);

  const [formData, setFormData] = useState({
    task_name: "",
    is_free: "0",
    task_budget: "",
    paid_budget: "",
    start_time: "",
    estimate_finish_time: "",
    assigned_dev_id: "",
    dev_budget: "",
    dev_paid: "",
    description: "",
  });

  useEffect(() => {
    setHeaderData({
      title: "Add New Job",
      subtitle: "Create a new job assignment",
      icon: "fa-solid fa-clipboard-list",
    });

    // প্রজেক্টের নাম এবং ডেভেলপার লিস্ট নিয়ে আসা
    const fetchInitialData = async () => {
      try {
        if (!getProjectId) {
          Swal.fire("Error", "Project ID is missing!", "error");
          navigate("/jobs");
          return;
        }

        const projRes = await api.get(`/admin/projects/${getProjectId}`);
        setProjectName(projRes.data.data.project_name);

        const devRes = await api.get("/admin/developers");
        setDevelopers(devRes.data.data);
      } catch (err) {
        console.error("Failed to load initial data", err);
        Swal.fire("Error", "Failed to load project details.", "error");
      } finally {
        setPageLoading(false);
      }
    };

    fetchInitialData();
  }, [setHeaderData, getProjectId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🎯 CKEditor এর জন্য আলাদা হ্যান্ডেলার
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  // 🎯 মেইন সাবমিট লজিক
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      project_id: getProjectId,
      job_name: formData.task_name,
      job_budget:
        formData.is_free === "1" ? 0 : Number(formData.task_budget || 0),
      paid_budget:
        formData.is_free === "1" ? 0 : Number(formData.paid_budget || 0),
      developer_id: formData.assigned_dev_id || null,
      developer_budget: Number(formData.dev_budget || 0),
      developer_paid: Number(formData.dev_paid || 0),
      is_free: formData.is_free,
      start_time: formData.start_time || null,
      estimate_finish_time: formData.estimate_finish_time || null,
      description: formData.description,
      job_status: "In Progress",
      payment_status: "Incompleted",
    };

    console.log("📡 Sending Payload to API:", payload);

    try {
      const res = await api.post("/admin/jobs", payload);
      console.log("✅ Server Response:", res.data);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Job Created!",
          text: "Job added and financial records updated safely.",
          timer: 2000,
          showConfirmButton: false,
          borderRadius: "2rem",
        });
        setTimeout(() => navigate(`/jobs?project_id=${getProjectId}`), 2000);
      }
    } catch (err) {
      console.error("❌ API CALL ERROR:", err.response?.data || err.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to create job",
        borderRadius: "2rem",
      });
    } finally {
      setLoading(false);
    }
  };

  // এনিমেশন কনফিগ
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (pageLoading) return <Loader />;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 pb-10 w-full custom-scrollbar"
    >
      {/* ১. প্রফেশনাল হেডার */}
      <motion.header
        variants={headerVariants}
        className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[20px] sm:rounded-[24px] px-5 py-4 shadow-sm mb-6 gap-4 sticky top-0 z-30"
      >
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 text-purple-600 rounded-xl hidden sm:flex items-center justify-center shadow-sm border border-purple-200 shrink-0">
            <i className="fa-solid fa-clipboard-list text-lg sm:text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-merriweather text-gray-900 leading-tight">
              Add New Task
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Create a new task assignment
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto justify-center px-5 py-3 sm:py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </motion.header>

      {/* ২. মেইন ফর্ম এরিয়া */}
      <form
        id="addJobForm"
        className="space-y-5 sm:space-y-6 max-w-4xl mx-auto mt-2"
        onSubmit={handleSubmit}
      >
        {/* Section 1: Basic Task Details */}
        <motion.div
          variants={cardVariants}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-layer-group text-purple-600 mr-2"></i> 1.
            Basic Task Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Task Title *
              </label>
              <input
                type="text"
                name="task_name"
                value={formData.task_name}
                placeholder="e.g. API Integration"
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Link to Project (Fixed)
              </label>
              <input
                type="text"
                value={projectName}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Task Status (Fixed)
              </label>
              <input
                type="text"
                value="In Progress"
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed shadow-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_time"
                value={formData.start_time}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Estimate Finish Date
              </label>
              <input
                type="date"
                name="estimate_finish_time"
                value={formData.estimate_finish_time}
                required
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-[#0F8FF0]/50 focus:ring-2 focus:ring-[#0F8FF0]/20 text-sm font-bold text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 2: Client Billing & Budget */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-file-invoice-dollar text-green-600 mr-2"></i>{" "}
            2. Client Billing & Budget
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Is this a Free Task?
              </label>
              <div className="relative">
                <select
                  name="is_free"
                  value={formData.is_free}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="0">No, It's Paid</option>
                  <option value="1">Yes, Free Task</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {formData.is_free === "0" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="budget-fields"
                  >
                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                      Client Charge (£) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="task_budget"
                      value={formData.task_budget}
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 text-base font-black text-green-700 transition-all shadow-sm"
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="budget-fields"
                  >
                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                      Already Paid (£)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="paid_budget"
                      value={formData.paid_budget}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-blue-50/50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F8FF0]/20 text-base font-black text-blue-700 transition-all shadow-sm"
                      onChange={handleChange}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Section 3: Internal Team & Cost */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-users-gear text-blue-600 mr-2"></i> 3.
            Internal Team & Cost
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 relative z-10">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Assign Developer
              </label>
              <div className="relative">
                <select
                  name="assigned_dev_id"
                  value={formData.assigned_dev_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-gray-800 transition-all shadow-sm appearance-none cursor-pointer uppercase"
                >
                  <option value="">-- Do Not Assign Yet --</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Developer Budget (£)
              </label>
              <input
                type="number"
                step="0.01"
                name="dev_budget"
                value={formData.dev_budget}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-base font-black text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
                Developer Paid (£)
              </label>
              <input
                type="number"
                step="0.01"
                name="dev_paid"
                value={formData.dev_paid}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-base font-black text-gray-800 transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
          </div>
        </motion.div>

        {/* 🎯 Section 4: Task Description with CKEditor */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] sm:rounded-[30px] p-5 sm:p-8 shadow-sm cute-card relative overflow-hidden group custom-ckeditor-wrapper"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <h2 className="text-lg sm:text-xl font-bold font-merriweather text-gray-900 mb-5 border-b border-gray-200/50 pb-4 relative z-10">
            <i className="fa-solid fa-align-left text-orange-600 mr-2"></i> 4.
            Task Description
          </h2>
          <div className="relative z-10">
            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest pl-1">
              Instructions / Details (Devs can see this)
            </label>

            <div className="bg-white/80 border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={handleEditorChange}
                config={{
                  placeholder: "Explain what needs to be done...",
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={cardVariants}
          transition={{ delay: 0.4 }}
          className="pt-2 pb-8 flex justify-end"
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin text-lg"></i>
            ) : (
              <i className="fa-solid fa-plus-circle text-lg"></i>
            )}
            {loading ? "Creating..." : "Create Job"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddJob;
